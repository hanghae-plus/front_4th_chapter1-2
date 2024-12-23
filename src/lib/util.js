export const isRenderedVNode = (vNode) =>
  vNode !== null && vNode !== undefined && typeof vNode !== "boolean";
