/**
 * @description 문자열, 숫자일 경우 true 반환
 */
export function isString(value) {
  return typeof value === "string" || typeof value === "number";
}
