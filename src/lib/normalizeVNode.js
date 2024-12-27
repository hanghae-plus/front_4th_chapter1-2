export function normalizeVNode(vNode) {
  // 1. null, undefined, boolean 처리
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  // 2. 문자열 또는 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. 배열 처리
  if (Array.isArray(vNode)) {
    return vNode
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== "" && child != null && child !== false);
  }

  // 4. 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: vNode.children,
      }),
    );
  }

  // 5. 객체(vNode)가 아닌 경우
  if (typeof vNode !== "object") {
    return "";
  }

  // 6. children 배열처리
  if (Array.isArray(vNode.children)) {
    const normalizedChildren = vNode.children
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== "" && child != null && child !== false);

    return {
      ...vNode,
      children: normalizedChildren,
    };
  }
  return vNode;
}
