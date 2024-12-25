import { NormalizedVNode, VNode } from "./types";

export function normalizeVNode(vNode: VNode): NormalizedVNode {
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "object") {
    const { type, children, props } = vNode;

    if (typeof type === "function") {
      return normalizeVNode(type({ ...props, children }));
    }

    if (Array.isArray(children)) {
      return {
        type,
        children: children
          .map((child) => normalizeVNode(child))
          .filter((child) => child != null && child !== ""),
        props: props,
      };
    }

    return {
      type,
      children,
      props: {
        ...vNode.props,
      },
    };
  }

  // if (typeof vNode === "string" || typeof vNode === "number") {
  return String(vNode);
}
