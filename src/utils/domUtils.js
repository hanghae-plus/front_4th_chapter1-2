export const isTextNode = (node) => ["string", "number"].includes(typeof node);
export const isRenderableVNode = (vNode) =>
  vNode != undefined && vNode != null && typeof vNode !== "boolean";
