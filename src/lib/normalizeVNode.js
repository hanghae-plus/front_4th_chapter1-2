import { isFalsyTypeWithoutZero } from "../utils/validateType";

export function normalizeVNode(vNode) {
  // vNode가 null, undefined 또는 boolean 타입일 경우 빈 문자열을 반환
  if (isFalsyTypeWithoutZero(vNode) || typeof vNode === "boolean") {
    return "";
  }

  // vNode가 문자열 또는 숫자일 경우 문자열로 변환하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화
  if (typeof vNode.type === "function") {
    const { type: Component, props = {}, children = [] } = vNode;

    const newVNode = Component({ children, ...props });
    return normalizeVNode(newVNode);
  }

  // 그 외의 경우, vNode의 자식 요소들을 재귀적으로 표준화하고, null 또는 undefined 값을 필터링하여 반환
  if (typeof vNode === "object") {
    const { type, props, children = [] } = vNode;

    const normalizedChildren = children
      .map(normalizeVNode)
      .filter((child) => !isFalsyTypeWithoutZero(child));

    return {
      type,
      props,
      children: normalizedChildren,
    };
  }
}
