export function normalizeVNode(vNode) {
  //null, undefined, boolean 값은 빈 문자열로 변환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  //문자열과 숫자는 문자열로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }

  // 자식 노드에서 falsy 값을 제거
  if (Array.isArray(vNode.children)) {
    vNode.children = vNode.children.filter(
      (child) => child !== null && child !== undefined && child !== false,
    );
  }

  console.log(vNode);

  // vNode.type이 함수형 컴포넌트인 경우 처리
  if (typeof vNode.type === "function") {
    // 함수형 컴포넌트를 호출하고 그 결과를 정규화
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  // 그 외의 경우, vNode 객체 자체를 반환 (정규화되지 않은 상태로)
  const { type, props = {}, children = [] } = vNode;

  // 자식 노드에서 falsy 값을 제거
  const normalizedChildren = children
    .filter((child) => child !== null && child !== undefined && child !== false)
    .map((child) => normalizeVNode(child));

  return {
    type,
    props,
    children: normalizedChildren,
  };
}
