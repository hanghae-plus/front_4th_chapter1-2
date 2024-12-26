export function normalizeVNode(vNode) {
  // 0은 문자열로 변환
  if (vNode === 0) return "0";

  // falsy 값 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    return vNode.flat(Infinity).map(normalizeVNode).filter(Boolean);
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    const props = { ...vNode.props, children: vNode.children };
    return normalizeVNode(Component(props));
  }

  // 기본 엘리먼트 처리
  if (typeof vNode === "object") {
    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children
        ? normalizeVNode(vNode.children).flat(Infinity)
        : [],
    };
  }

  // 원시값 처리 (문자열, 숫자 등)
  return String(vNode);
}
