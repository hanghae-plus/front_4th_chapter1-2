export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      // 모든 중첩 배열을 평탄화
      // 0을 제외한 falsy(null, undefined, false, '', NaN 등)는 필터링
      .flat(Infinity)
      .filter((child) => child === 0 || child),
  };
}
