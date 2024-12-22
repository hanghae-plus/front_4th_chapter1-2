export function createVNode(type, props, ...children) {
  const flattenedChildren = children
    .flat(Infinity) // 자식 배열의 중첩된 배열을 완전히 평탄화
    .filter(
      (child) => child !== null && child !== undefined && child !== false, // null, undefined, false인 요소를 걸러냄
    );

  // children.flat(Infinity): 자식 배열의 중첩된 배열을 완전히 평탄화한다
  return { type, props, children: flattenedChildren };
}
