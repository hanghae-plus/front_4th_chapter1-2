export function normalizeVNode(vNode) {
  if (!validate(vNode)) {
    return "";
  }
  if (isString(vNode)) {
    return vNode.toString();
  }

  return vNode;
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
