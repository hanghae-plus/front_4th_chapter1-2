export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  if (Array.isArray(vNode)) {
    return vNode.flatMap(normalizeVNode).filter(Boolean);
  }

  if (typeof vNode.type === "function") {
    const componentOutput = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });
    return normalizeVNode(componentOutput);
  }

  if (vNode.children) {
    const normalizedChildren = normalizeVNode(vNode.children);
    return {
      ...vNode,
      children: Array.isArray(normalizedChildren)
        ? normalizedChildren.filter(Boolean)
        : [normalizedChildren],
    };
  }

  return vNode;
}
