import { isValidVNodeType } from "@/utils/jsxUtils";

type Type = HTMLElementTagNameMap;
type Props = { [key: string]: any };
type Children = any[];

interface VNode {
  type: Type;
  props: Props;
  children: Children;
}

export function createVNode(
  type: HTMLElementTagNameMap,
  props: Props,
  ...children: Children
): VNode {
  return {
    type,
    props,
    children: (children ?? []).flat(Infinity).filter(isValidVNodeType),
  };
}
