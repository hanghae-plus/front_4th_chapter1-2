// 다양한 타입의 가상 노드(vNode)를 표준화된 형태로 변환하고 일관된 형식의 "가상 노드를 반환".
// (DOM 조작이나 렌더링 과정에서 일관된 데이터 구조를 사용할 수 있도록)
export function normalizeVNode(vNode) {
  // "vNode가" null, undefined 또는 boolean 타입일 경우 빈 문자열 반환.
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }
  // vNode가 문자열 또는 숫자일 경우 문자열로 변환하여 반환.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return `${vNode}`;
  }

  // "vNode의 타입"이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화.
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  // 그 외의 경우, vNode의 자식 요소들을 재귀적으로 표준화하고, null 또는 undefined 값을 필터링하여 반환.
  return {
    ...vNode,
    children: vNode.children.map(normalizeVNode).filter(Boolean),
  };
}
