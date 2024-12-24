export function normalizeVNode(vNode) {
  // null, undefined, boolean -> 빈 문자열
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  // 문자열, 숫자 -> 문자열
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 함수형 컴포넌트
  if (typeof vNode === "function") {
    return normalizeVNode(vNode());
  }

  if (vNode && typeof vNode === "object") {
    // 함수형 컴포넌트
    if (typeof vNode.type === "function") {
      return normalizeVNode(
        vNode.type({
          ...vNode.props,
          children: vNode.children,
        }),
      );
    }

    // children 정규화
    const children = Array.isArray(vNode.children) ? vNode.children : [];
    const normalizedChildren = children
      .map((child) => normalizeVNode(child))
      .filter(
        (child) =>
          child !== null &&
          child !== undefined &&
          child !== false &&
          child !== "",
      );

    return {
      type: vNode.type,
      props: vNode.props,
      children: normalizedChildren,
    };
  }

  return vNode;
}
