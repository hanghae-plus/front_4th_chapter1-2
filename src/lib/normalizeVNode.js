export function normalizeVNode(vNode) {
  //null, undefined, boolean
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  //number, string
  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  //함수형 컴포넌트
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  const { children = [], ...rest } = vNode;
  const normalizedChildren = children
    .filter((child) => (child || child === 0) && child !== true)
    .map(normalizeVNode);

  return {
    ...rest,
    children: normalizedChildren,
  };
}
