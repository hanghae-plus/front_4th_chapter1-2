export function normalizeVNode(vNode) {
  // null, undefined, 또는 boolean 타입일 경우 빈 문자열 반환
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  // 문자열 또는 숫자일 경우 문자열로 변환하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 타입이 함수일 경우 해당 함수를 호출하고 재귀적으로 표준화
  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    const props = { ...(vNode.props || {}), children: vNode.children };
    const result = Component(props);
    return normalizeVNode(result); // createVNode을 사용하지 않고 직접 result를 정규화
  }

  // 배열일 경우 각 요소를 재귀적으로 표준화
  if (Array.isArray(vNode)) {
    return vNode
      .map(normalizeVNode) // 자식 요소를 표준화
      .filter((child) => child != null && child !== ""); // null 또는 undefined 필터링
  }

  // 객체일 경우 처리
  if (typeof vNode === "object" && vNode !== null) {
    const { type, props, children } = vNode;

    // 자식 요소를 재귀적으로 표준화
    const normalizedChildren = Array.isArray(children)
      ? children
          .map(normalizeVNode) // 자식 요소를 표준화
          .filter((child) => child != null && child !== "") // null 또는 undefined 필터링
      : children != null
        ? [normalizeVNode(children)] // 단일 자식 표준화
        : []; // 자식이 없을 경우 빈 배열

    return {
      type,
      props: props || null,
      children: normalizedChildren,
    };
  }

  // 다른 경우는 반환하지 않고 기본적으로 빈 문자열 처리
  return "";
}
