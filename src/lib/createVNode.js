// TODO : .flat이 성능적으로 좋지 않다. 최적화가 필요하다.
// https://velog.io/@milkcoke/Javascript-Array.flat-%EC%9D%80-%EB%8A%90%EB%A6%AC%EB%8B%A4 참고
export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((child) => child === 0 || Boolean(child)),
  };
}
