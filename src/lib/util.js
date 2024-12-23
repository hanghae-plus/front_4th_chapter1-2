export const isRenderedVNode = (vNode) =>
  vNode !== null && vNode !== undefined && typeof vNode !== "boolean";

export const isTextVNode = (vNode) =>
  typeof vNode === "string" || typeof vNode === "number";
