/** @jsx createVNode */
/** @jsxFrag Fragment */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createVNode, renderElement } from "../../lib";

describe("Chapter1-2 > 심화과제 > Virtual DOM과 이벤트 관리", () => {
  let container;

  beforeEach(async () => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("renderElement > ", () => {
    it("초기 렌더링이 올바르게 수행되어야 한다", () => {
      const vNode = <div id="test">Hello</div>;
      renderElement(vNode, container);
      expect(container.innerHTML).toBe('<div id="test">Hello</div>');
    });

    it("diff 알고리즘을 통해 변경된 부분만 업데이트해야 한다", () => {
      const initialVNode = (
        <div>
          <h1>Title</h1>
          <p>Paragraph 1</p>
        </div>
      );
      renderElement(initialVNode, container);

      const originalH1 = container.querySelector("h1");
      const originalP = container.querySelector("p");

      console.log("🚀 이전:", container.innerHTML);
      const updatedVNode = (
        <div>
          <h1>Updated Title</h1>
          <p>Paragraph 1</p>
        </div>
      );
      renderElement(updatedVNode, container);
      console.log("🚀 이후:", container.innerHTML);
      expect(container.innerHTML).toBe(
        "<div><h1>Updated Title</h1><p>Paragraph 1</p></div>",
      );
      expect(container.querySelector("h1")).toBe(originalH1); // 같은 요소 참조 확인
      expect(container.querySelector("p")).toBe(originalP); // 같은 요소 참조 확인
      expect(container.querySelector("h1").textContent).toBe("Updated Title");
      expect(container.querySelector("p").textContent).toBe("Paragraph 1");
    });

    it("새로운 요소를 추가하고 불필요한 요소를 제거해야 한다", () => {
      const initialVNode = (
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      );
      renderElement(initialVNode, container);

      const originalFirstLi = container.querySelector("li:first-child");

      const updatedVNode = (
        <ul>
          <li>Item 1</li>
          <li>New Item</li>
          <li>Item 3</li>
        </ul>
      );
      renderElement(updatedVNode, container);

      expect(container.querySelectorAll("li").length).toBe(3);
      expect(container.querySelector("li:nth-child(2)").textContent).toBe(
        "New Item",
      );
      expect(container.querySelector("li:first-child")).toBe(originalFirstLi); // 같은 요소 참조 확인
    });

    it("요소의 속성만 변경되었을 때 요소를 재사용해야 한다", () => {
      const initialVNode = (
        <div id="test" className="old">
          Hello
        </div>
      );
      renderElement(initialVNode, container);

      const originalDiv = container.querySelector("div");

      const updatedVNode = (
        <div id="test" className="new">
          Hello
        </div>
      );
      renderElement(updatedVNode, container);

      expect(container.innerHTML).toBe(
        '<div id="test" class="new">Hello</div>',
      );
      expect(container.querySelector("div")).toBe(originalDiv); // 같은 요소 참조 확인
    });

    it("요소의 타입이 변경되었을 때 새로운 요소를 생성해야 한다", () => {
      const initialVNode = <div>Hello</div>;
      renderElement(initialVNode, container);

      const originalElement = container.firstChild;

      const updatedVNode = <span>Hello</span>;
      renderElement(updatedVNode, container);

      expect(container.innerHTML).toBe("<span>Hello</span>");
      expect(container.firstChild).not.toBe(originalElement); // 다른 요소 참조 확인
    });

    it("함수형 컴포넌트가 업데이트될 때 필요한 부분만 렌더링해야 한다", () => {
      const FuncComponent = ({ title, content }) => (
        <div>
          <h1>{title}</h1>
          <p>{content}</p>
        </div>
      );

      const initialVNode = (
        <FuncComponent title="Initial Title" content="Initial Content" />
      );
      renderElement(initialVNode, container);

      const originalH1 = container.querySelector("h1");
      const originalP = container.querySelector("p");

      const updatedVNode = (
        <FuncComponent title="Updated Title" content="Initial Content" />
      );
      renderElement(updatedVNode, container);

      expect(container.querySelector("h1")).toBe(originalH1);
      expect(container.querySelector("p")).toBe(originalP);
      expect(container.querySelector("h1").textContent).toBe("Updated Title");
      expect(container.querySelector("p").textContent).toBe("Initial Content");
    });

    it("중첩된 함수형 컴포넌트에서 깊은 레벨의 변경사항만 업데이트해야 한다", () => {
      const ChildComponent = ({ text }) => <p>{text}</p>;
      const ParentComponent = ({ title, childText }) => (
        <div>
          <h1>{title}</h1>
          <ChildComponent text={childText} />
        </div>
      );

      const initialVNode = (
        <ParentComponent title="Parent Title" childText="Child Text" />
      );

      renderElement(initialVNode, container);

      const originalH1 = container.querySelector("h1");
      const originalP = container.querySelector("p");

      const updatedVNode = (
        <ParentComponent title="Parent Title" childText="Updated Child Text" />
      );
      renderElement(updatedVNode, container);

      expect(container.querySelector("h1")).toBe(originalH1);
      expect(container.querySelector("p")).toBe(originalP);
      expect(container.querySelector("h1").textContent).toBe("Parent Title");
      expect(container.querySelector("p").textContent).toBe(
        "Updated Child Text",
      );
    });
  });
});
