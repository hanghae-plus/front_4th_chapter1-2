export function normalizeVNode(vNode) {
  // vNode가 null, undefined, boolean 타입일 경우 빈 문자열 반환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // vNode가 문자열, 숫자일 경우 문자열로 변환하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화
  // if (typeof vNode === "object" && typeof vNode.type === "function") {
  //   const result = vNode.type(vNode.props || {});

  //   if (result && result.children) {
  //     const normalizedChild = result.children.map(normalizeVNode)
  //       ? result.children.map(normalizeVNode)
  //       : [normalizeVNode(result.children)];

  //     result.children = normalizedChild;
  //   }

  //   return normalizeVNode(result);
  // }
  // 컴포넌트 렌더링
  if (typeof vNode.type === "function") {
    const { type, props, children } = vNode;
    vNode = normalizeVNode(type({ ...props, children })); // type({ ...props, children }) 호출 후 결과를 재귀적으로 표준화
  }

  // if (vNode && typeof vNode === "object") {
  //   const { children, type, props } = vNode;

  //   const normalizedChildren = Array.isArray(children)
  //   ? children.filter(
  //       (child) =>
  //         child !== null && child !== undefined && child !== false && child !== true
  //     )
  //   : children;

  //   // props = null -> return
  //   const normalizedProps = props === null ? null : { ...props };
  //   return { type, props: normalizedProps, children: normalizedChildren };
  // }

  vNode.children = [...vNode.children] // 자식 노드 반복호출
    .map(normalizeVNode)
    .filter((child) => !!child); // 모든 falsy값 제거

  return vNode;
}
