export function normalizeVNode(vNode) {
  // null, undefined, boolean → 빈 문자열 처리
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  // 문자열 및 숫자 → 문자열 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    const { type, props } = vNode;

    const componentVNode = type({ ...(props || {}), children: vNode.children });
    return normalizeVNode(componentVNode);
  }

  // 배열 처리 → 중첩된 배열 평탄화 및 빈 값 제거
  if (Array.isArray(vNode)) {
    return vNode
      .flatMap((child) => normalizeVNode(child))
      .filter((child) => child !== "");
  }

  // 객체 타입(VNode) 처리
  if (typeof vNode === "object" && vNode.type) {
    const normalizedChildren = Array.isArray(vNode.children)
      ? vNode.children
          .flatMap((child) => normalizeVNode(child))
          .filter((child) => child !== "")
      : [normalizeVNode(vNode.children)].filter((child) => child !== "");

    return {
      type: vNode.type,
      props: vNode.props,
      children: normalizedChildren,
    };
  }

  // 기타 값 → 빈 문자열 처리
  return "";
}
