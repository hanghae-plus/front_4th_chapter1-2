export function normalizeVNode(vNode) {
  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
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

  if (Array.isArray(vNode.children)) {
    vNode.children = vNode.children.filter(normalizeVNode).map(normalizeVNode);
  }

  return vNode;
}
