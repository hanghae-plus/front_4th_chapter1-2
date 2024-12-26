/**
 * 함수 형태의 엘리먼트를 Virtual DOM 노드로 변환
 */
export function normalizeVNode(vNode) {
  // null, undefined, boolean 처리
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  // 문자열이나 숫자를 그대로 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode);
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    const props = { ...vNode.props };
    if (vNode.children.length > 0) {
      props.children = vNode.children;
    }
    // 함수를 실행하여 반환하는 JSX를 다시 정규화
    return normalizeVNode(vNode.type(props));
  }

  // 일반 엘리먼트의 자식 노드 정규화
  return {
    ...vNode,
    children: vNode.children
      .map(normalizeVNode)
      .filter((child) => child !== ""),
  };
}
