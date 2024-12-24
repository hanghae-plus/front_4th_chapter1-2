// 도메인을 정의할 수 없는 유틸들 모음

export function checkNullishExceptZero(value) {
  // 0은 falsy한 값이 아니고 숫자로 처리할 것이다.
  if (value === 0) return true;
  return Boolean(value);
}
