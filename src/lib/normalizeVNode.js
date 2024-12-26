export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const renderedElement = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });
    return normalizeVNode(renderedElement);
  }

  if (Array.isArray(vNode)) {
    return vNode.map((child) => normalizeVNode(child));
  }

  if (vNode.children) {
    vNode.children = vNode.children
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== "" && child !== null && child !== undefined);
  }

  return vNode;
}
