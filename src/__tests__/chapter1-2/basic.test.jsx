/** @jsx createVNode */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addEvent,
  createElement,
  createVNode,
  normalizeVNode,
  removeEvent,
  renderElement,
  setupEventListeners,
} from "../../lib";

describe("Chapter1-2 > 기본과제 > 가상돔 만들기 > ", () => {
  describe("createVNode > ", () => {
    it("올바른 구조의 vNode를 생성해야 한다", () => {
      const vNode = createVNode("div", { id: "test" }, "Hello");
      expect(vNode).toEqual({
        type: "div",
        props: { id: "test" },
        children: ["Hello"],
      });
    });

    it("여러 자식을 처리해야 한다", () => {
      const vNode = createVNode("div", null, "Hello", "world");
      expect(vNode.children).toEqual(["Hello", "world"]);
    });

    it("자식 배열을 평탄화해야 한다", () => {
      const vNode = createVNode("div", null, ["Hello", ["world", "!"]]);
      expect(vNode.children).toEqual(["Hello", "world", "!"]);
    });

    it("중첩 구조를 올바르게 표현해야 한다", () => {
      const vNode = createVNode(
        "div",
        null,
        createVNode("span", null, "Hello"),
        createVNode("b", null, "world"),
      );
      expect(vNode.type).toBe("div");
      expect(vNode.children.length).toBe(2);
      expect(vNode.children[0].type).toBe("span");
      expect(vNode.children[1].type).toBe("b");
    });

    describe("JSX로 표현한 결과가 createVNode 함수 호출과 동일해야 한다", () => {
      const TestComponent = ({ message }) => <div>{message}</div>;
      const ComplexComponent = ({ items, onClick }) => (
        <div className="container">
          {items.map((item) => (
            <span key={item.id}>{item.text}</span>
          ))}
          <button onClick={onClick}>Click me</button>
        </div>
      );

      it.each([
        {
          name: "기본적인 단일 엘리먼트",
          vNode: <div>Hello</div>,
          expected: {
            type: "div",
            props: null,
            children: ["Hello"],
          },
        },
        {
          name: "속성이 있는 엘리먼트",
          vNode: (
            <div id="test" className="container">
              Content
            </div>
          ),
          expected: {
            type: "div",
            props: { id: "test", className: "container" },
            children: ["Content"],
          },
        },
        {
          name: "중첩된 엘리먼트",
          vNode: (
            <div id="parent">
              <span className="child">Child</span>
            </div>
          ),
          expected: {
            type: "div",
            props: { id: "parent" },
            children: [
              {
                type: "span",
                props: { className: "child" },
                children: ["Child"],
              },
            ],
          },
        },
        {
          name: "배열 렌더링",
          vNode: (
            <ul>
              {[1, 2, 3].map((n, index) => (
                <li key={n}>
                  Item {index}: {n}
                </li>
              ))}
            </ul>
          ),
          expected: {
            type: "ul",
            props: null,
            children: [
              {
                type: "li",
                props: { key: 1 },
                children: ["Item ", 0, ": ", 1],
              },
              {
                type: "li",
                props: { key: 2 },
                children: ["Item ", 1, ": ", 2],
              },
              {
                type: "li",
                props: { key: 3 },
                children: ["Item ", 2, ": ", 3],
              },
            ],
          },
        },
        {
          name: "함수형 컴포넌트",
          vNode: <TestComponent message="Hello World" />,
          expected: {
            type: TestComponent,
            props: { message: "Hello World" },
            children: [],
          },
        },
        {
          name: "이벤트 핸들러가 있는 엘리먼트",
          vNode: <button onClick={() => {}}>Click</button>,
          expected: {
            type: "button",
            props: { onClick: expect.any(Function) },
            children: ["Click"],
          },
        },
        {
          name: "조건부 렌더링",
          vNode: (
            <div>
              {true && <span>Shown</span>}
              {false && <span>Hidden</span>}
            </div>
          ),
          expected: {
            type: "div",
            props: null,
            children: [{ type: "span", props: null, children: ["Shown"] }],
          },
        },
        {
          name: "복잡한 컴포넌트 구조",
          vNode: (
            <ComplexComponent
              items={[
                { id: 1, text: "First" },
                { id: 2, text: "Second" },
              ]}
              onClick={() => {}}
            />
          ),
          expected: {
            type: ComplexComponent,
            props: {
              items: [
                { id: 1, text: "First" },
                { id: 2, text: "Second" },
              ],
              onClick: expect.any(Function),
            },
            children: [],
          },
        },
        {
          name: "null과 undefined 처리",
          vNode: (
            <div>
              {null}
              {undefined}
              <span>Valid</span>
            </div>
          ),
          expected: {
            type: "div",
            props: null,
            children: [{ type: "span", props: null, children: ["Valid"] }],
          },
        },
      ])("$name", ({ vNode, expected }) => {
        expect(vNode).toEqual(expected);
      });
    });
  });

  describe("normalizeVNode", () => {
    it.each([
      [null, ""],
      [undefined, ""],
      [true, ""],
      [false, ""],
    ])(
      "null, undefined, boolean 값은 빈 문자열로 변환되어야 한다. (%s)",
      (input, expected) => {
        expect(normalizeVNode(input)).toBe(expected);
      },
    );

    it.each([
      ["hello", "hello"],
      [123, "123"],
      [0, "0"],
      [-42, "-42"],
    ])("문자열과 숫자는 문자열로 변환되어야 한다. (%s)", (input, expected) => {
      expect(normalizeVNode(input)).toBe(expected);
    });

    it("컴포넌트를 정규화한다.", () => {
      const UnorderedList = ({ children, ...props }) => (
        <ul {...props}>{children}</ul>
      );
      const ListItem = ({ children, className, ...props }) => (
        <li {...props} className={`list-item ${className ?? ""}`}>
          - {children}
        </li>
      );
      const TestComponent = () => (
        <UnorderedList>
          <ListItem id="item-1">Item 1</ListItem>
          <ListItem id="item-2">Item 2</ListItem>
          <ListItem id="item-3" className="last-item">
            Item 3
          </ListItem>
        </UnorderedList>
      );

      const normalized = normalizeVNode(<TestComponent />);

      expect(normalized).toEqual(
        <ul {...{}}>
          <li id="item-1" className="list-item ">
            {"- "}Item 1
          </li>
          <li id="item-2" className="list-item ">
            {"- "}Item 2
          </li>
          <li id="item-3" className="list-item last-item">
            {"- "}Item 3
          </li>
        </ul>,
      );
    });

    it("Falsy 값 (null, undefined, false)은 자식 노드에서 제거되어야 한다.", () => {
      const normalized = normalizeVNode(
        <div>
          유효한 값{null}
          {undefined}
          {false}
          {true}
          <span>자식 노드</span>
        </div>,
      );

      expect(normalized).toEqual(
        <div>
          유효한 값<span>자식 노드</span>
        </div>,
      );
    });
  });

  describe("createElement", () => {
    let container;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it.each([
      [undefined, ""],
      [null, ""],
      [false, ""],
      [true, ""],
    ])("%s는 빈 텍스트 노드로 변환된다.", (input, expected) => {
      const result = createElement(input);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe(expected);
    });

    it.each([
      ["Hello", "Hello"],
      [42, "42"],
      [0, "0"],
      [-0, "0"],
      [10000, "10000"],
    ])("%s은 텍스트 노드로 변환된다.", (input, expected) => {
      const result = createElement(input);
      expect(result.nodeType).toBe(Node.TEXT_NODE);
      expect(result.textContent).toBe(expected);
    });

    it("배열 입력에 대해 DocumentFragment를 생성해야 한다", () => {
      const result = createElement([<div>첫 번째</div>, <span>두 번째</span>]);

      expect(result.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("DIV");
      expect(result.childNodes[1].tagName).toBe("SPAN");
    });

    describe("컴포넌트를 element로 만들기", () => {
      it("컴포넌트를 createElement로 처리하려고 하면 오류가 발생한다.", () => {
        const FuncComponent = ({ text }) => <div>{text}</div>;
        expect(() =>
          createElement(<FuncComponent text="Hello" />),
        ).toThrowError();
      });

      it("컴포넌트를 정규화한 다음에 createElement로 생성할 수 있다.", () => {
        const UnorderedList = ({ children, ...props }) => (
          <ul {...props}>{children}</ul>
        );
        const ListItem = ({ children, className, ...props }) => (
          <li {...props} className={`list-item ${className ?? ""}`}>
            - {children}
          </li>
        );
        const TestComponent = () => (
          <UnorderedList>
            <ListItem id="item-1">Item 1</ListItem>
            <ListItem id="item-2">Item 2</ListItem>
            <ListItem id="item-3" className="last-item">
              Item 3
            </ListItem>
          </UnorderedList>
        );

        expect(
          createElement(normalizeVNode(<TestComponent />)).outerHTML,
        ).toEqual(
          `<ul><li id="item-1" class="list-item ">- Item 1</li><li id="item-2" class="list-item ">- Item 2</li><li id="item-3" class="list-item last-item">- Item 3</li></ul>`,
        );
      });
    });

    it("중첩된 자식 요소를 올바르게 처리해야 한다", () => {
      const result = createElement(
        <div>
          <span>Hello</span>
          <b>world</b>
        </div>,
      );
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("SPAN");
      expect(result.childNodes[1].tagName).toBe("B");
    });

    it("깊게 중첩된 구조를 처리해야 한다", () => {
      const result = createElement(
        <div>
          <span>
            <a href="#">링크</a>
            <b>굵게</b>
          </span>
          <p>문단</p>
        </div>,
      );
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(2);
      expect(result.childNodes[0].tagName).toBe("SPAN");
      expect(result.childNodes[0].childNodes.length).toBe(2);
      expect(result.childNodes[0].childNodes[0].tagName).toBe("A");
      expect(result.childNodes[0].childNodes[1].tagName).toBe("B");
      expect(result.childNodes[1].tagName).toBe("P");
    });

    it("혼합 콘텐츠(텍스트와 요소)를 처리해야 한다", () => {
      const result = createElement(
        <div>
          텍스트
          <span>span 안의 텍스트</span>더 많은 텍스트
        </div>,
      );
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(3);
      expect(result.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
      expect(result.childNodes[1].tagName).toBe("SPAN");
      expect(result.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
    });

    it("빈 자식 배열을 처리해야 한다", () => {
      const result = createElement(<div>{[]}</div>);
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(0);
    });

    it("undefined 자식을 무시해야 한다", () => {
      const result = createElement(<div>{undefined}</div>);
      console.log("🚀 ~ it ~ result:", result);
      expect(result.tagName).toBe("DIV");
      expect(result.childNodes.length).toBe(0);
    });

    it("불리언 속성을 처리해야 한다", () => {
      const result = createElement(<input disabled={true} />);
      expect(result.tagName).toBe("INPUT");
      expect(result.disabled).toBe(true);
    });

    it("데이터 속성을 처리해야 한다", () => {
      const result = createElement(<div data-test="값" />);
      expect(result.tagName).toBe("DIV");
      expect(result.dataset.test).toBe("값");
    });
  });

  describe("eventManager", () => {
    let container;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it("이벤트가 위임 방식으로 등록되어야 한다", () => {
      const clickHandler = vi.fn();
      const button = document.createElement("button");
      container.appendChild(button);

      addEvent(button, "click", clickHandler);
      setupEventListeners(container);
      button.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);

      const handleClick = (e) => e.stopPropagation();
      button.addEventListener("click", handleClick);
      button.click();
      expect(clickHandler).toHaveBeenCalledTimes(1);

      expect(clickHandler).toHaveBeenCalledTimes(1);
      button.removeEventListener("click", handleClick);
      button.click();
      expect(clickHandler).toHaveBeenCalledTimes(2);
    });

    it("이벤트 핸들러가 제거되면 더 이상 호출되지 않아야 한다", () => {
      const clickHandler = vi.fn();
      const button = document.createElement("button");
      container.appendChild(button);

      addEvent(button, "click", clickHandler);
      setupEventListeners(container);
      button.click();
      expect(clickHandler).toHaveBeenCalledTimes(1);

      removeEvent(button, "click", clickHandler);
      button.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("renderElement", () => {
    let $container;

    beforeEach(async () => {
      $container = document.createElement("div");
      document.body.appendChild($container);
    });

    afterEach(() => {
      document.body.removeChild($container);
      $container = null;
    });

    it("render를 실행할 경우, vNode가 html로 변환되고 이벤트가 등록된다.", () => {
      const UnorderedList = ({ children, ...props }) => (
        <ul {...props}>{children}</ul>
      );
      const ListItem = ({ children, className, ...props }) => (
        <li {...props} className={`list-item ${className ?? ""}`}>
          {children}
        </li>
      );

      const clickHandler = vi.fn();
      const mouseOverHandler = vi.fn();
      const focusHandler = vi.fn();
      const keyDownHandler = vi.fn();

      const items = [
        { id: 1, children: <button onClick={clickHandler} /> },
        { id: 2, children: <div onMouseOver={mouseOverHandler} /> },
        { id: 3, children: <input onFocus={focusHandler} /> },
        { id: 4, children: <input onKeyDown={keyDownHandler} /> },
      ];

      const TestComponent = () => (
        <UnorderedList>
          {items.map((item, index) => (
            <ListItem
              id={`item-${item.id}`}
              className={`list-item ${items.length - 1 === index ? "last-item" : ""}`}
            >
              {item.children}
            </ListItem>
          ))}
        </UnorderedList>
      );

      renderElement(<TestComponent />, $container);

      expect($container.innerHTML).toEqual(
        `<ul><li id="item-1" class="list-item list-item "><button></button></li><li id="item-2" class="list-item list-item "><div></div></li><li id="item-3" class="list-item list-item "><input></li><li id="item-4" class="list-item list-item last-item"><input></li></ul>`,
      );

      $container.querySelector("#item-1").firstChild.click();
      expect(clickHandler).toHaveBeenCalledTimes(1);

      const mouseEvent = new MouseEvent("mouseover", { bubbles: true });
      $container.querySelector("#item-2").firstChild.dispatchEvent(mouseEvent);
      expect(mouseOverHandler).toHaveBeenCalledTimes(1);

      const focusEvent = new FocusEvent("focus", { bubbles: true });
      $container.querySelector("#item-3").firstChild.dispatchEvent(focusEvent);
      expect(focusHandler).toHaveBeenCalledTimes(1);

      const keyboardEvent = new KeyboardEvent("keydown", { bubbles: true });
      $container
        .querySelector("#item-4")
        .firstChild.dispatchEvent(keyboardEvent);
      expect(keyDownHandler).toHaveBeenCalledTimes(1);
    });

    it("이벤트가 위임 방식으로 등록되어야 한다", () => {
      const clickHandler = vi.fn();
      const vNode = (
        <div>
          <button onClick={clickHandler}>Click me</button>
        </div>
      );
      renderElement(vNode, $container);

      const button = $container.querySelector("button");
      button.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    it("동적으로 추가된 요소에도 이벤트가 정상적으로 작동해야 한다", () => {
      const clickHandler = vi.fn();
      const initialVNode = (
        <div>
          <button onClick={clickHandler}>Initial Button</button>
        </div>
      );
      renderElement(initialVNode, $container);

      const updatedVNode = (
        <div>
          <button onClick={clickHandler}>Initial Button</button>
          <button onClick={clickHandler}>New Button</button>
        </div>
      );
      renderElement(updatedVNode, $container);

      const newButton = $container.querySelectorAll("button")[1];
      newButton.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    it("이벤트 핸들러가 제거되면 더 이상 호출되지 않아야 한다", () => {
      const clickHandler = vi.fn();
      const initialVNode = (
        <div>
          <button onClick={clickHandler}>Button</button>
        </div>
      );
      renderElement(initialVNode, $container);

      const updatedVNode = (
        <div>
          <button>Button Without Handler</button>
        </div>
      );
      renderElement(updatedVNode, $container);

      const button = $container.querySelector("button");
      button.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });
});
