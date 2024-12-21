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
    const { type, props, children } = vNode;
    const result = type({ ...props, children });
    vNode = normalizeVNode(result);
  }

  vNode.children = vNode.children
    .map((child) => {
      const childNode = normalizeVNode(child);
      return childNode;
    })
    .filter((child) => !!child);

  return vNode;
}
