//가상 DOM을 생성하는 함수
export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((child) => (child === 0 ? true : Boolean(child))),
  };
}
