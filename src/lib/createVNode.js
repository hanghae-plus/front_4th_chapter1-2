import { isRenderableVNode } from "../utils/domUtils";

export function createVNode(type, props, ...childrens) {
  const flatChildren = childrens
    .flat(Infinity)
    .filter((children) => isRenderableVNode(children));

  return {
    type,
    props,
    children: flatChildren,
  };
}
