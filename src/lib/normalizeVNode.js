export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    typeof vNode === "boolean" ||
    typeof vNode === "undefined"
  ) {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return `${vNode}`;
  }

  if (typeof vNode.type === "function") {
    const component = vNode.type({
      ...(vNode.props || {}),
      children: vNode.children,
    });
    return normalizeVNode(component);
  }

  if (Array.isArray(vNode)) {
    return vNode
      .map((child) => normalizeVNode(child))
      .filter((child) => child || child === 0);
  }

  return {
    ...vNode,
    children: vNode.children
      .map((child) => normalizeVNode(child))
      .filter((child) => child || child === 0),
  };
}
