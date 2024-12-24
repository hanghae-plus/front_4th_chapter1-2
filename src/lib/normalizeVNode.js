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
    const { type, props, children } = vNode;
    vNode = normalizeVNode(type({ ...props, children }));
  }

  vNode.children = [...vNode.children]
    .map(normalizeVNode)
    .filter((child) => !!child);

  return vNode;
}
