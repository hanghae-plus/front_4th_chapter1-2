export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }

  if (typeof vNode.type === "function") {
    const temp = vNode.type({ children: vNode.children, ...vNode.props });
    return normalizeVNode(temp);
  }

  const children = vNode.children.map((child) => normalizeVNode(child));

  return {
    ...vNode,
    children,
  };
}
