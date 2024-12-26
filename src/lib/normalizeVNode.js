export function normalizeVNode(vNode) {
  if (typeof vNode === "string" || typeof vNode === "number") {
    return `${vNode}`;
  } else if (typeof vNode === "boolean" || !vNode) {
    return "";
  } else if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ children: vNode.children, ...vNode.props }),
    );
  }

  const children = vNode.children.map(normalizeVNode).filter((v) => v !== "");

  return { ...vNode, children };
}
