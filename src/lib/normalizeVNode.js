export function normalizeVNode(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const componentVNode = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });
    return normalizeVNode(componentVNode);
  }

  if (typeof vNode === "object" && vNode !== null) {
    if (Array.isArray(vNode.children)) {
      vNode.children = vNode.children
        .map(normalizeVNode)
        .filter((child) => child != null && child !== "");
    }
    return vNode;
  }

  return vNode;
}
