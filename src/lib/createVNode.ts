import { isValidVNodeType } from "@/utils/jsxUtils";
import { Children, Props, VNode } from "@/types/VNode";

export function createVNode(
  type: keyof HTMLElementTagNameMap,
  props: Props,
  ...children: Children
): VNode {
  return {
    type,
    props,
    children: (children ?? []).flat(Infinity).filter(isValidVNodeType),
  };
}
