export function createVNode(type, props, ...children) {
  return {
    type, // 노드의 타입
    props, // 해당 노드의 적용할 속성
    children: children // 이 노드의 자식 요소들
      .flat(Infinity) // 모든 중첩 배열을 평탄화함.
      .filter(
        // 자식 요소에서 0을 제외한 falsy값을 제거
        (child) =>
          child !== false &&
          child !== null &&
          child !== undefined &&
          child !== "" &&
          !Number.isNaN(child),
      ),
  };
}
