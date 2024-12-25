import { isString } from "../utils/isString";
import { isValid } from "../utils/isValid";

/**
 * 가상 노드(vNode)를 표준 형식으로 정규화하는 함수
 * @description 조건에 따라 vNode를 정규화하고, 정규화된 vNode를 반환한다.
 * 1. vNode가 null, undefined, boolean인 경우 빈 문자열을 반환한다.
 * 2. vNode가 문자열 또는 숫자인 경우 해당 값을 문자열로 반환한다.
 * 3. vNode가 함수 타입인 경우 해당 함수를 호출하며 반환된 값을 정규화한다.
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
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  if (vNode.children && vNode.children.length) {
    vNode.children = vNode.children.filter(isValid).map(normalizeVNode);
  }

  return vNode;
}
