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
        children: normalizeVNode(vNode.children),
      }),
    );
  }

  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode);
  }

  if (Array.isArray(vNode.children)) {
    vNode.children = vNode.children.filter(normalizeVNode);
  }

  return vNode;
}
