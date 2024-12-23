// 주어진 가상 노드(vNode)를 표준화된 형태로 변환하는 역할을 합니다.

export function normalizeVNode(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode);
  }

  if (typeof vNode.type === "function") {
    const props = { ...vNode.props };
    if (vNode.children.length > 0) {
      props.children = vNode.children;
    }
    // 함수를 실행하여 반환하는 JSX를 다시 정규화
    return normalizeVNode(vNode.type(props));
  }

  return {
    ...vNode,
    children: vNode.children
      .map(normalizeVNode)
      .filter((child) => child !== ""),
  };
}
