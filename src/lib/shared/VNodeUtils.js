export const isFalsy = (vNode) =>
  vNode === null || vNode === undefined || typeof vNode === "boolean";

export const isStringOrNumber = (vNode) =>
  typeof vNode === "string" || typeof vNode === "number";

export const isFunction = (vNode) => typeof vNode === "function";

export const isObject = (vNode) => typeof vNode === "object";

export const isArray = (vNode) => vNode && Array.isArray(vNode);
