export function normalizeVNode(vNode) {
  if (!vNode || typeof vNode === "boolean") {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return `${vNode}`;
  }

  if (typeof vNode === "function") {
    const component = vNode();
    return normalizeVNode(component);
  }

  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode).join("");
  }

  return normalizeVNode(vNode.children);
}
