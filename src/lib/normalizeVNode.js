export function normalizeVNode(vNode) {
  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }
  return {
    ...vNode,
    children: vNode.children
      .filter((child) => child || child === 0)
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== ""),
  };
}
