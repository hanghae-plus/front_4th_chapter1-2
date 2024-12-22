export function normalizeVNode(vNode) {
  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return "";
  }
  console.log(vNode);
  return vNode;
}
