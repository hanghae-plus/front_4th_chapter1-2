export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  if (typeof vNode === "string") {
    return vNode;
  }

  if (typeof vNode === "number") {
    return vNode.toString();
  }

  if (typeof vNode.type === "function") {
    const renderedVNode = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });
    return normalizeVNode(renderedVNode);
  }

  const children = Array.isArray(vNode.children)
    ? vNode.children
    : [vNode.children];

  let result = children
    .map((child) => normalizeVNode(child))
    .filter((child) => child !== null && child !== "undefined" && child);

  return {
    ...vNode,
    children: result,
  };
}
