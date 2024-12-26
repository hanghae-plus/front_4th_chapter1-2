export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return "";

  if (typeof vNode === "string" || typeof vNode === "number")
    return String(vNode);

  if (typeof vNode === "function") {
    return normalizeVNode(vNode());
  }

  if (typeof vNode === "object") {
    if (vNode.children && Array.isArray(vNode.children)) {
      vNode.children = vNode.children
        .map((child) => normalizeVNode(child))
        .filter(
          (child) => child !== null && child !== undefined && child !== "",
        );
    }

    return vNode;
  }

  return "";
}
