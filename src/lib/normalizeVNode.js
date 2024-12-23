export function normalizeVNode(vNode) {
  if (
    vNode == null ||
    typeof vNode === "undefined" ||
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

  return {
    ...vNode,
    children: vNode.children
      .map((child) => normalizeVNode(child))
      .filter((child) => child || child === 0),
  };
}
