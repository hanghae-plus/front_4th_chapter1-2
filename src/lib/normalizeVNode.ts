export function normalizeVNode(vNode) {
  // null, undefined, boolean 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 문자열이나 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 배열인 경우 (여러 자식 요소)
  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode);
  }

  // 컴포넌트인 경우
  if (typeof vNode.type === "function") {
    const { type: Component, props } = vNode;
    return normalizeVNode(Component({ ...props, children: vNode.children }));
  }

  // 그 외의 경우 (일반 DOM 요소의 경우)
  return {
    ...vNode,
    children: vNode.children
      .map(normalizeVNode)
      .filter((child) => child !== ""),
  };
}
