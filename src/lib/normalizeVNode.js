export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }
  if (typeof vNode.type === "function") {
    const { type, props, children } = vNode;
    vNode = normalizeVNode(type({ ...props, children }));
  }
  return {
    ...vNode,
    children: vNode.children
      .map((child) => normalizeVNode(child))
      .filter((child) => child || child === 0),
  };
}
