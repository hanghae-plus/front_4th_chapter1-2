import { recursiveFlatten } from "../utils/arrayUtils";

const checkNullishExceptZero = (value) => {
  // 0은 falsy한 값이 아니고 숫자로 처리할 것이다.
  if (value === 0) return true;
  return Boolean(value);
};

export function createVNode(type, props, ...children) {
  const flattenedChildren = recursiveFlatten(children, checkNullishExceptZero);

  return { type, props, children: flattenedChildren };
}
