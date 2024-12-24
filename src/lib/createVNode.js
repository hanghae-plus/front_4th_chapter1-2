export function createVNode(type, props, ...children) {
  // children 평탄화
  children = children.flat(Infinity).filter(
    (child) => child !== false && child !== null && child !== undefined, //false, null, undefined 제거
  );

  return { type, props, children };
}
