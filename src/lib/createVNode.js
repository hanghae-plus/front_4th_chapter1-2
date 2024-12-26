/**
 * Virtual DOM 노드를 생성
 * 자식 요소는 모두 평탄화하며, 유효하지 않은 자식 요소는 제거
 */
export function createVNode(type, props, ...children) {
  return {
    type,
    props: props || null,
    children: children
      .flat(Infinity)
      .filter((child) => child != null && child !== false && child !== true),
  };
}
