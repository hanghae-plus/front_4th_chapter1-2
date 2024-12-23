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

  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode).join("");
  }

  return {
    ...vNode,
    children: vNode.children.map(normalizeVNode).filter(Boolean),
  };
}
