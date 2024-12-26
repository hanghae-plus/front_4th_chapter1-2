export function normalizeVNode(vNode) {
  // 1. null, undefined, boolean 값은 빈 문자열로 변환
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === true ||
    vNode === false
  ) {
    return "";
  }

  // 2. 문자열과 숫자는 문자열로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. 컴포넌트를 정규화
  // 배열처리 중첩 배열을 평탄화하고, 모든 요소를 재귀적으로 정규화
  if (Array.isArray(vNode)) {
    return vNode.flat(Infinity).map(normalizeVNode);
  }

  // 사용자 정의 컴포넌트 처리 (컴포넌트 정규화)
  if (typeof vNode.type === "function") {
    const result = vNode.type({
      ...vNode.props,
      children: normalizeVNode(vNode.children),
    });
    return normalizeVNode(result);
  }

  // 기본 노드 처리
  if (typeof vNode.type === "string") {
    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children.flat(Infinity).filter(normalizeVNode),
    };
  }

  return vNode;
}
