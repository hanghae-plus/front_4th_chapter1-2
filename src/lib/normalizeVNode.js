import {
  isFalsy,
  isFunction,
  isObject,
  isStringOrNumber,
} from "./shared/index.js";

export function normalizeVNode(vNode) {
  if (isFalsy(vNode)) return "";

  if (isStringOrNumber(vNode)) return String(vNode);

  if (isFunction(vNode.type)) {
    const { type, props, children } = vNode;

    return normalizeVNode(type({ ...props, children }));
  }

  if (isObject(vNode)) {
    if (vNode.children && Array.isArray(vNode.children)) {
      vNode.children = vNode.children
        .map((child) => normalizeVNode(child))
        .filter(
          (child) => child !== null && child !== undefined && child !== "",
        );
    }

    return vNode;
  }

  return "";
}
