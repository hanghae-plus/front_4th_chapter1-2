const isRenderedVNode = (vNode) =>
  vNode !== null && vNode !== undefined && typeof vNode !== "boolean";

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter(isRenderedVNode),
  };
}
