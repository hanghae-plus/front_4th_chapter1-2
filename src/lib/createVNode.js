import { recursiveFlatten } from "../utils/arrayUtils";
import { checkNullishExceptZero } from "../utils/commonUtils";

export function createVNode(type, props, ...children) {
  const flattenedChildren = recursiveFlatten(children, (val) => {
    return checkNullishExceptZero(val);
  });

  return { type, props, children: flattenedChildren };
}
