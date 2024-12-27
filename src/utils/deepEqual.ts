export function deepEqual(a, b): a is typeof b {
  // 1. 엄격 비교(===)로 먼저 빠른 확인.
  //    (원시 값이 같거나, null과 undefined 케이스 등)
  if (a === b) {
    return true;
  }

  // 2. null이거나 객체가 아니면(false) 더 이상의 비교 불필요
  //    (typeof null === 'object' 주의)
  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  // 3. 둘 다 Date 객체라면 시각(타임스탬프) 비교
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 4. 둘 다 Array인지, 아니면 일반 Object인지 비교에 맞춰 진행
  const isArrayA = Array.isArray(a);
  const isArrayB = Array.isArray(b);
  if (isArrayA && isArrayB) {
    // 4-1. 배열일 경우: 길이부터 비교 후 모든 원소를 재귀적으로 비교
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else if (isArrayA !== isArrayB) {
    // 하나만 배열이면 당연히 다름
    return false;
  }

  // 5. 일반 객체(Object)일 경우: 키(key) 목록 비교 및 각 프로퍼티 재귀 비교
  //   - Object.keys / Object.getOwnPropertyNames / Reflect.ownKeys 등을 사용할 수 있음
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  // 키 개수가 다르면 다른 객체
  if (keysA.length !== keysB.length) {
    return false;
  }

  // 모든 키와 그 값을 재귀적으로 비교
  for (let key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}
