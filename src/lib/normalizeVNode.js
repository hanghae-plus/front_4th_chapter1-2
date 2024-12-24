import { isString } from "../utils/isString";
import { isValid } from "../utils/isValid";

/**
 * 가상 노드(vNode)를 표준 형식으로 정규화하는 함수
 * @description 조건에 따라 vNode를 정규화하고, 정규화된 vNode를 반환한다.
 * 1. vNode가 null, undefined, boolean인 경우 빈 문자열을 반환한다.
 * 2. vNode가 문자열 또는 숫자인 경우 해당 값을 문자열로 반환한다.
 * 3. vNode가 함수 타입인 경우 해당 함수를 호출하며 정규화된 vNode({type, props, children})를 반환한다.
 * 4. 모든 자식 노드를 정규화한다.
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
    vNode = normalizeFunctionType(vNode);
  }

  if (vNode.children && vNode.children.length) {
    vNode.children = normalizeChildren(vNode.children) || [];
  }

  return vNode;
}

/**
 * 함수 타입 정규화
 * @description vNode가 함수 타입인 경우 해당 함수를 호출하며 정규화된 vNode({type, props, children})를 반환
 * children이 문자열 배열인 경우 문자열을 합쳐서 반환하고, 그 외의 경우는 normalizeChildren 함수를 통해 정규화
 * @param {Object} vNode
 * @returns {Object} 정규화된 vNode
 * @returns {string|Function} returns.type: normalizeVNode 함수 실행 결과의 type
 * @returns {Object} returns.props: 함수 실행 결과의 props
 * @returns {Array} returns.children: normalizeChildren 함수를 통해 children 요소 정규화
 */
function normalizeFunctionType(vNode) {
  const renderedVNode = vNode.type(vNode.props || {});

  if (typeof renderedVNode.type === "function") {
    renderedVNode.type = normalizeFunctionType(renderedVNode).type;
  }

  const mergedChildren = [
    ...(renderedVNode.children || []),
    ...(vNode.children || []),
  ];

  return {
    type: renderedVNode.type,
    props: renderedVNode.props || {},
    children: normalizeChildren(mergedChildren),
  };
}

/**
 * 자식 노드 정규화
 * @description 자식 노드 중 문자열이 연속되는 경우 합쳐서 반환하고, 그 외의 경우는 normalizeVNode 함수를 통해 정규화
 * @param {Array} children
 * @returns {Array} 정규화된 자식 노드
 */
function normalizeChildren(children) {
  if (!children || !children.length) return [];

  return children
    .filter(isValid)
    .map((child) => (isString(child) ? child : normalizeVNode(child)));
}
