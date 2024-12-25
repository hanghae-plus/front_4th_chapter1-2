export function normalizeVNode(vNode) {
  if (
    vNode == null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 배열인 경우
  if (Array.isArray(vNode)) {
    return vNode
      .map((child) => normalizeVNode(child))
      .filter((child) => child || child === 0);
  }

  //함수인 경우
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  return {
    ...vNode,
    children: vNode.children
      .map((child) => normalizeVNode(child))
      .filter((child) => child || child === 0),
  };
}
