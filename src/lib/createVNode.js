import { isFalsyTypeWithoutZero } from "../utils/validateType";

export function createVNode(type, props, ...children) {
  // children은 평탄화(flat)되어야 하며, 0을 제외한 falsy 값은 필터링
  const flatChildren = children
    .flat(Infinity)
    .map((child) => {
      if (isFalsyTypeWithoutZero(child)) {
        return null;
      }

      if (typeof child === "object") {
        const { type, props, children } = child;
        return createVNode(type, props, ...children);
      }

      return child;
    })
    .filter((child) => child !== null);

  return {
    type,
    props,
    children: flatChildren,
  };
}
