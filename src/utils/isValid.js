/**
 * @description null, undefined, boolean 일 경우 false 반환
 */
export function isValid(value) {
  return !(value == null || typeof value === "boolean");
}
