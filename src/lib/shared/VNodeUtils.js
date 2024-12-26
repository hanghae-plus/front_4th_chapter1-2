export const checkFalsy = (vNode) =>
  vNode === null || vNode === undefined || typeof vNode === "boolean";

export const checkStringOrNumber = (vNode) =>
  typeof vNode === "string" || typeof vNode === "number";

export const checkFunction = (vNode) => typeof vNode === "function";

export const checkObject = (vNode) => typeof vNode === "object";

export const checkArray = (vNode) => vNode && Array.isArray(vNode);
