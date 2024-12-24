/**
 * 개인적으로 만든 순수함수들에 대한 테스트 입니다.
 */

import { recursiveFlatten } from "../../utils/arrayUtils";

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
