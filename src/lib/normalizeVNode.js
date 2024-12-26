export function normalizeVNode(vNode) {
  // 기본 타입 처리
  const isNullOrBoolean = (value) =>
    value == null || typeof value === "boolean";
  const isPrimitive = (value) =>
    typeof value === "string" || typeof value === "number";
  const isFunction = (value) => typeof value === "function";
  const isComponent = (value) =>
    value && typeof value === "object" && isFunction(value.type);

  // 빈 값 처리
  if (isNullOrBoolean(vNode)) {
    return "";
  }

  // 원시 타입 처리
  if (isPrimitive(vNode)) {
    return String(vNode);
  }

  // 함수형 컴포넌트 직접 호출 케이스
  if (isFunction(vNode)) {
    return normalizeVNode(vNode());
  }

  if (vNode && typeof vNode === "object") {
    // 함수형 컴포넌트 객체 케이스
    if (isComponent(vNode)) {
      const props = {
        ...vNode.props,
        children: vNode.children,
      };
      return normalizeVNode(vNode.type(props));
    }

    // children 정규화
    const normalizedChildren = normalizeChildren(vNode.children);

    return {
      type: vNode.type,
      props: vNode.props,
      children: normalizedChildren,
    };
  }

  return vNode;
}

// children 정규화
function normalizeChildren(children) {
  const childArray = Array.isArray(children) ? children : [];
  return childArray
    .map((child) => normalizeVNode(child))
    .filter((child) => {
      const isEmptyValue =
        child === null ||
        child === undefined ||
        child === false ||
        child === "";
      return !isEmptyValue;
    });
}
