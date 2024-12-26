import {
  checkFalsy,
  checkFunction,
  checkObject,
  checkStringOrNumber,
} from "./shared/index.js";

export function normalizeVNode(vNode) {
  if (checkFalsy(vNode)) return "";

  if (checkStringOrNumber(vNode)) return String(vNode);

  if (checkFunction(vNode.type)) {
    const { type, props, children } = vNode;

    return normalizeVNode(type({ ...props, children }));
  }

  if (checkObject(vNode)) {
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
