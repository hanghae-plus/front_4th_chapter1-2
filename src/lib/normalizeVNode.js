import { isInvalidValue, isValidValue } from "./helpers";

export function normalizeVNode(vNode) {
  if (isInvalidValue(vNode)) {
    return "";
  }

  if (typeof vNode === "number") {
    return vNode.toString();
  }

  if (Array.isArray(vNode)) {
    return vNode.flat(Infinity).filter(isValidValue).map(normalizeVNode);
  }

  if (typeof vNode === "object") {
    const { type, props, children } = vNode;

    if (typeof type === "function") {
      return normalizeVNode(type({ ...props, children }));
    }

    return { type, props, children: normalizeVNode(children) };
  }

  return vNode;
}
