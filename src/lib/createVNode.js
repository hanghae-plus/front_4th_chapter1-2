export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    // 기존
    // children: (children.flat(Infinity)).filter((childX) => !!childX)
    // 개선
    //개선1 : children: (children.flat(Infinity)).filter(Boolean) -> 이 경우 0을 falsy로 인식하여 리턴 제외함
    //개선2 : 최종
    children: children
      .flat(Infinity)
      .filter((childX) => (childX === 0 ? true : Boolean(childX))), // 완전 평탄화
  };
}
