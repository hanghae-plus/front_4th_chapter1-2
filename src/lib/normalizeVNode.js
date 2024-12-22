//생성된 가상 DOM을 정규화하여 일관된 형태로 변환 하는 함수
export function normalizeVNode(vNode) {
  if (
    typeof vNode === "undefined" ||
    vNode === null ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: vNode.children,
      }),
    );
  }

  return {
    ...vNode,
    children: vNode.children.map(normalizeVNode).filter(Boolean),
  };
}
