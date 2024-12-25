import { VNode, VNodeProps } from "./type";
import { isBooleanTrue, isNumberZero } from "./typeChecker";

export function createVNode(
  type: string,
  props: VNodeProps,
  ...children: unknown[]
): VNode {
  return {
    type,
    props,
    children: children?.flat(Infinity).filter((child) => {
      return (child && !isBooleanTrue(child)) || isNumberZero(child);
    }),
  };
}
