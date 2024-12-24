/**
 * 가상 노드를 생성하는 함수
 * @description type, props, children을 인자로 받아 가상 노드를 생성
 * - children 요소 중 0, null, undefined는 제외
 * - children을 flat하게 만들고, 각 요소를 flatMap
 * @param {*} type
 * @param {*} props
 * @param  {...any} children
 * @returns {Object} vNode
 */
export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((child) => (child === 0 || child ? true : false))
      .flatMap((child) => child),
  };
}
