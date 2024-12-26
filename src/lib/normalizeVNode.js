export function normalizeVNode(vNode) {
  // 1. vNode가 null, undefined 또는 boolean 타입일 경우 빈 문자열을 반환합니다.
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 2. vNode가 문자열 또는 숫자일 경우 문자열로 변환하여 반환합니다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화합니다.
  // 이 때, props를 컴포넌트 호출 할 때 보내줘야함
  if (typeof vNode.type === "function") {
    const props = vNode.props || {};

    if (vNode.children && vNode.children.length > 0) {
      props.children = vNode.children;
    }
    return normalizeVNode(vNode.type(props));
  }

  // 4. 그 외의 경우, vNode의 자식 요소들을 재귀적으로 표준화하고, null 또는 undefined 값을 필터링하여 반환합니다.
  return {
    ...vNode,
    children: Array.isArray(vNode.children)
      ? vNode.children.map(normalizeVNode).filter((item) => item || item === 0)
      : vNode.children,
  };
}
