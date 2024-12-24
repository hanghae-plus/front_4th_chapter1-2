export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  if (Array.isArray(vNode.children)) {
    vNode.children = vNode.children
      .map((value) => normalizeVNode(value))
      .filter((child) => child != null && child !== "");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  vNode.children = vNode.children.map((value) => normalizeVNode(value));

  return vNode;
}
