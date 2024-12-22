export function normalizeVNode(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "object") {
    const { type, props, children } = vNode;

    if (typeof type === "function") {
      return normalizeVNode(type(props, children));
    }

    if (Array.isArray(children)) {
      return {
        type: vNode.type,
        children: children
          .map((child) => normalizeVNode(child))
          .filter((child) => child != null && child !== ""),
        props: { ...props },
      };
    }
    return vNode;
  }

  // if (typeof vNode === "string" || typeof vNode === "number") {
  return String(vNode);
}
