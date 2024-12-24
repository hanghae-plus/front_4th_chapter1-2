export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return "";
  if (typeof vNode === "string" || typeof vNode === "number")
    return vNode.toString();

  const { type, props, children } = vNode;

  // 함수형 컴포넌트를 호출하여 반환값 처리
  if (typeof type === "function") {
    return normalizeVNode(type({ ...props, children }));
  }

  const normalChild = children
    .filter(
      (child) =>
        child !== undefined &&
        child !== null &&
        child !== false &&
        child !== true &&
        child !== "",
    )
    .map(normalizeVNode);

  return {
    type,
    props,
    children: normalChild,
  };
}
