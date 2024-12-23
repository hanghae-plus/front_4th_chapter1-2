/**
 * 가상돔 노드 생성하는 역할
 * 조건 : children은 평탄화(flat)되어야 하며, 0을 제외한 Falsy는 필터
 */

export function createVNode(type, props, ...children) {
  return {
    type,
    props: props || null,
    children: children.flat(Infinity).filter((child) => child === 0 || child),
  };
}
