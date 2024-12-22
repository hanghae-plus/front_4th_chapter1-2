export function normalizeVNode(vNode) {
  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }
  if (!vNode || typeof vNode === "boolean") {
    return "";
  }
  return vNode;
}
