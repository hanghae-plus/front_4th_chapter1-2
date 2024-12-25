export function createVNode(type, props, ...children) {
  // 자식 배열을 평탄화하고 null/undefined 제거
  const flattenChildren = flatten(children);

  return {
    type,
    props,
    children: flattenChildren,
  };
}

// 배열을 평탄화하고 null/undefined를 제거하는 함수
function flatten(children) {
  return children.reduce((acc, child) => {
    // null/undefined 값은 무시
    if (child === null || child === undefined) {
      return acc;
    }

    // 조건부 렌더링 예: 특정 조건에 맞으면 자식으로 추가하지 않음
    // 예: Boolean 값일 경우 무시 (조건을 추가할 수 있음)
    if (typeof child === "boolean") {
      return acc;
    }

    if (Array.isArray(child)) {
      // 자식이 배열일 경우 재귀적으로 평탄화
      acc.push(...flatten(child));
    } else {
      // 다른 값은 정상적으로 자식으로 추가
      acc.push(child);
    }

    return acc;
  }, []);
}
