/**
 * 주어진 가상 노드를 표준화 된 형태로 변환.
 *
 * @param vNode - 가상 노드
 * @returns 가상 노드 반환
 * @description
 * 다양한 타입의 가상 노드(vNode)를 표준화된 형태로 변환하고 일관된 형식의 "가상 노드를 반환".
 * - vNode가 null, undefined 또는 boolean 타입일 경우 빈 문자열 반환합니다.
 * - vNode가 문자열 또는 숫자일 경우 문자열로 변환하여 반환합니다.
 * - vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화합니다.
 * - 그 외의 경우, vNode의 자식 요소들을 재귀적으로 표준화하고, null 또는 undefined 값을 필터링하여 반환합니다.
 */
export function normalizeVNode(vNode) {
  // 기본값 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 텍스트 노드 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return `${vNode}`;
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    // 함수형 컴포넌트는 일반적으로 JSX 또는 vNode로 변환되어야 렌더링될 수 있기때문에 해당 함수를 호출하여 컴포넌트가 반환하는 결과를 다시 표준화한다.
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  // 객체 노드 처리 및 자식 노드 표준화
  return {
    ...vNode,
    children: vNode.children.map(normalizeVNode).filter(Boolean),
  };
}
