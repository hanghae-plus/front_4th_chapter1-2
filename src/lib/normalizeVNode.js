export function normalizeVNode(vNode) {
  //null, undefined, boolean 처리

  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return "";
  }
  // 문자열, 숫자 -> 문자열로 처리
  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }
  // vNode가 function일 때
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: vNode.children.filter(
          (child) => child !== null && child !== undefined && child !== false,
        ),
      }),
    );
  }
  if (Array.isArray(vNode.children)) {
    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children
        .filter(
          (child) =>
            child !== null && child !== undefined && typeof child !== "boolean",
        )
        .map((child) => normalizeVNode(child)),
    };
  }

  return {
    ...vNode,
    children: normalizeVNode(vNode.children),
  };
}
