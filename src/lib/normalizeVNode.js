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
