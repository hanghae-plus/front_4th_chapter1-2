export const isRenderableVNode = (vNode) =>
  vNode !== null && vNode !== undefined && typeof vNode !== "boolean";

export const isTextVNode = (vNode) =>
  typeof vNode === "string" || typeof vNode === "number";

export const isEventProps = (key) => key.startsWith("on");

export const isClassNameProps = (key) => key === "className";
