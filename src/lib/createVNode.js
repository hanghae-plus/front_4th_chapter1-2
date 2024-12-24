// 평탄화 로직 : 발사대
export function createVNode(type, props, ...children) {
  // type : vNode 객체의 하나의 속성 / 가상 DOM 트리의 상위 노드를 정의함
  // type 을 평탄화하는 것은 중첩된 vNode 를 1차원 배열로 변환하여 각 자식 노드들을 단순화하는 작업을 의미함
  const normalChild = children.flat(Infinity).filter(
    (
      child, // 0을 제외한 falsy 값은 필터링 되어야 한다
    ) =>
      child !== undefined &&
      child !== null &&
      child !== false &&
      child !== true,
  );

  return {
    type,
    props,
    children: normalChild,
  };
}
