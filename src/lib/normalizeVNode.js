export function normalizeVNode(vNode) {
  if (!validate(vNode)) {
    return "";
  }
  if (isString(vNode)) {
    return vNode.toString();
  }

  if (typeof vNode.type === "function") {
    const renderedVNode = vNode.type(vNode.props || {});
    const isChildrenTextArray =
      Array.isArray(renderedVNode.children) &&
      renderedVNode.children.every((child) => typeof child === "string");

    return {
      type: normalizeVNode(renderedVNode).type,
      props: renderedVNode.props || {},
      children: isChildrenTextArray
        ? [...renderedVNode.children, ...normalizeChildren(vNode.children)]
        : normalizeChildren(renderedVNode.children),
    };
  }

  const children = normalizeChildren(vNode.children);

  return {
    type: vNode.type,
    props: vNode.props || null,
    children,
  };
}

/**
 * @description 자식 노드 정규화
 */
function normalizeChildren(children) {
  if (!children) return [];

  return children.reduce((acc, child) => {
    const normalizedChild = isString(child) ? child : normalizeVNode(child);

    const last = acc[acc.length - 1];
    if (typeof last === "string" && typeof normalizedChild === "string") {
      acc[acc.length - 1] = last + normalizedChild;
    } else {
      acc.push(normalizedChild);
    }

    return acc;
  }, []);
}

/**
 * @description null, undefined, boolean 일 경우 false 반환
 */
function validate(value) {
  return !(value == null || typeof value === "boolean");
}

/**
 * @description 문자열, 숫자일 경우 true 반환
 */
function isString(value) {
  return typeof value === "string" || typeof value === "number";
}
