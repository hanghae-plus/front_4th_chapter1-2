// 도메인을 정의할 수 없는 유틸들 모음

export function checkNullishExceptZero(value) {
  // 0은 falsy한 값이 아니고 숫자로 처리할 것이다.
  if (value === 0) return true;
  return Boolean(value);
}

/**
 * @description prop이 className인 경우 class로 변경
 * @param {object} prop
 * @returns {string}
 */
export function replaceIfPropIsClass(prop) {
  return prop === "className" ? "class" : prop;
}
