export const isValidVNode = (vNode) =>
  vNode !== null && typeof vNode !== "undefined" && typeof vNode !== "boolean";

export const isString = (vNode) => typeof vNode === "string";

export const isNumber = (vNode) => typeof vNode === "number";
