export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === true ||
    vNode === false
  ) {
    return "";
  }
  //문자열과 숫자는 문자열로 변환되어야 한다
  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }
  //컴포넌트 정규화
  if (typeof vNode.type === "function") {
    const result = vNode.type({ ...vNode.props, children: vNode.children });
    return normalizeVNode(result);
  }
  //Falsy값(null, undefined, false)은 자식 노드에서 제거되어야 한다.
  const filteredChildren = vNode.children.filter(
    (child) =>
      child !== null &&
      child !== undefined &&
      child !== false &&
      child !== true, // 이것 까지 추가하면 Falsy값이 아니지 않나? boolean을 따로 처리해줘야하나?
  );

  return {
    type: vNode.type,
    props: vNode.props,
    children: filteredChildren.map((child) => normalizeVNode(child)),
  };
}
