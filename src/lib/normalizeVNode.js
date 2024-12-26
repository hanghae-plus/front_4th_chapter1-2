export function normalizeVNode(vNode) {
  // null, undefined, boolean 처리
  if (
    vNode == null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  // 문자열 또는 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 컴포넌트인 경우
  if (typeof vNode.type === "function") {
    // 컴포넌트를 호출하여 VNode 생성
    const { props, children } = vNode; // props와 children 분리
    const componentVNode = vNode.type({ ...props, children }); // children을 포함하여 전달
    return normalizeVNode(componentVNode); // 재귀적으로 정규화
  }

  // 그 외의 경우, 자식 요소들을 재귀적으로 표준화
  if (vNode && typeof vNode === "object") {
    const children = [...vNode.children]
      .map(normalizeVNode)
      .filter((child) => child);
    return { ...vNode, children };
  }

  return vNode; // 기본 반환
}
