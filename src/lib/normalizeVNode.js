/**
 * 가상 노드(vNode)를 표준 형식으로 정규화하는 함수
 * @param {Object} vNode - 정규화할 가상 노드
 * @returns {Object|string} 정규화된 가상 노드 또는 vNode가 유효하지 않은 경우 빈 문자열을 반환
 */
export function normalizeVNode(vNode) {
  if (!isValid(vNode)) {
    return "";
  }
  if (isString(vNode)) {
    return vNode.toString();
  }

  if (typeof vNode.type === "function") {
    return normalizeFunctionType(vNode);
  }

  const children = normalizeChildren(vNode.children);

  return {
    type: vNode.type,
    props: vNode.props || null,
    children,
  };
}

/**
 * 함수 타입 정규화
 * @description vNode가 함수 타입인 경우 해당 함수를 호출하며 정규화된 vNode({type, props, children})를 반환
 * @param {Object} vNode
 * @returns {Object} 정규화된 vNode
 * @returns {string|Function} returns.type: normalizeVNode 함수 실행 결과의 type
 * @returns {Object} returns.props: 함수 실행 결과의 props
 * @returns {Array} returns.children: normalizeChildren 함수를 통해 children 요소 정규화
 */
function normalizeFunctionType(vNode) {
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

/**
 * 자식 노드 정규화
 * @description 자식 노드 중 문자열이 연속되는 경우 합쳐서 반환하고, 그 외의 경우는 normalizeVNode 함수를 통해 정규화
 * @param {Array} children
 * @returns {Array} 정규화된 자식 노드
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
function isValid(value) {
  return !(value == null || typeof value === "boolean");
}

/**
 * @description 문자열, 숫자일 경우 true 반환
 */
function isString(value) {
  return typeof value === "string" || typeof value === "number";
}
