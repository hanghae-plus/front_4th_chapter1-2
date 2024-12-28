import { isValidValue } from "./helpers";

export function createVNode(type, props, ...children) {
  // NOTE: 왜 여기서 바로 normalizeVNode를 돌리면 안 될까?
  // return normalizeVNode({ type, props, children });

  return {
    type,
    props,
    children: children.flat(Infinity).filter(isValidValue),
  };
}
