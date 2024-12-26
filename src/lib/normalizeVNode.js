export function normalizeVNode(vNode) {
  if (
    typeof vNode === "undefined" ||
    vNode === null ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  // if (Array.isArray(vNode)) {
  //   return vNode.map(normalizeVNode).join("");
  // }

  const children = Array.isArray(vNode.children)
    ? vNode.children
    : vNode.children
      ? [vNode.children]
      : [];

  return {
    ...vNode,
    children: children.map(normalizeVNode).filter(Boolean),
  };
}
