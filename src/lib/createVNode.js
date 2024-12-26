/**
 * 자식 항목들을 평탄화하고, null, undefined, true, false 값을 제거
 * @param {Array} items - 평탄화할 항목들
 * @returns {Array} - 평탄화된 배열과 불필요한 값들이 제거된 배열
 */
function flattenChildren(items) {
  return items
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null &&
        child !== undefined &&
        child !== false &&
        child !== true,
    );
}

/**
 * 주어진 타입, props, 자식들을 이용해 새로운 vNode를 생성
 * @param {string|function} type - vNode의 타입 (문자열 또는 컴포넌트 함수)
 * @param {object} props - vNode의 속성
 * @param {...*} children - vNode의 자식들
 * @returns {VNode} - 생성된 가상 DOM 노드
 */
export function createVNode(type, props, ...children) {
  return {
    type,
    props: props,
    children: flattenChildren(children),
  };
}
