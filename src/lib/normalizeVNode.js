export function normalizeVNode(vNode) {
  // null, undefined
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 컴포넌트 정규화 처리, 컴포넌트 함수를 일관된 계층 구조로 변환
  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    // props와 children을 합쳐서 전달한다
    const props = {
      ...vNode.props,
      children: vNode.children || [],
    };
    // 컴포넌트를 실행하고 그 결과를 다시 정규화합니다
    return normalizeVNode(Component(props));
  }

  // 자식 노드의 falsy 값 제거: null, undefined, false 등의 falsy값이 빈 문자열로 변환된 후 filter에 의해 제거된다
  // children을 배열로 변환하고, filter에 의해 falsy 값이 제거된다
  const children = vNode.children || [];
  const normalizedChildren = (Array.isArray(children) ? children : [children])
    .flatMap((child) =>
      Array.isArray(child)
        ? child.map((c) => normalizeVNode(c))
        : normalizeVNode(child),
    )
    .filter((child) => {
      // falsy 값 제거
      if (child === null || child === undefined || child === false)
        return false;
      // 공백만 있는 문자열 제거
      if (typeof child === "string" && child.trim() === "") return false;
      return true;
    });

  return {
    type: vNode.type,
    props: vNode.props,
    children: normalizedChildren,
  };
}
