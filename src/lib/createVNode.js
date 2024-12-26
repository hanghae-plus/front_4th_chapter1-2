export function createVNode(type, props, ...children) {
  // 1. type, props, ...children을 매개변수로 받는 함수를 작성하세요.
  // 1. 반환값은 { type, props, children } 형태의 객체여야 합니다.
  // 2. children은 평탄화(flat)되어야 하며, 0을 제외한 falsy 값은 필터링되어야 합니다.

  return {
    type,
    props,
    children: children.flat(Infinity).filter((child) => child || child === 0),
  };
}
