/**
 * 개인적으로 만든 순수함수들에 대한 테스트 입니다.
 */

import { describe } from "vitest";
import { recursiveFlatten } from "../../utils/arrayUtils";
import { renderElement } from "../../lib";

describe("유틸 함수 체크", () => {
  describe("recursiveFlatten", () => {
    it("올바른 구조의 평탄화된 배열을 생성해야 한다", () => {
      const vNode = recursiveFlatten([
        "Hello",
        ["world", ["i", "am", ["junman"]], "!"],
      ]);
      expect(vNode).toEqual(["Hello", "world", "i", "am", "junman", "!"]);
    });

    it("falsy한 값은 포함되지 않아야 한다.", () => {
      const vNode = recursiveFlatten(
        ["Hello", [null, [undefined], "world", "!"]],
        (value) => Boolean(value),
      );

      expect(vNode).toEqual(["Hello", "world", "!"]);
    });
  });
});

/** @jsx createVNode */
/** @jsxFrag Fragment */
import { createVNode, Fragment } from "../../lib";

describe("이벤트 매니저 버블링 테스트", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });
  it("이벤트가 버블링 되는 것 처럼 동작해야한다.", () => {
    const clickHandler1 = vi.fn();
    const clickHandler2 = vi.fn();

    const Component = () => (
      <div id="parent" onClick={clickHandler1}>
        <div id="child" onClick={clickHandler2}></div>
      </div>
    );
    renderElement(<Component />, container);

    const child = container.querySelector("#child");
    child.click();
    expect(clickHandler1).toHaveBeenCalledTimes(1);
    expect(clickHandler2).toHaveBeenCalledTimes(1);
  });
});
