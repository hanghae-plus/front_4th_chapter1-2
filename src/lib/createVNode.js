export function createVNode(type, props, ...children) {
  // 평탄화 및 falsy 값 필터링
  children = children
    .flat(Infinity)
    .filter((child) => child != null && child !== false);
  return { type, props, children };
}
