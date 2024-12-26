export function normalizeVNode(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ children: vNode.children, ...vNode.props }),
    );
  }

  if (typeof vNode === "object") {
    const { type, props, children } = vNode;

    const normalizedChildren = children
      .flat(Infinity)
      .map(normalizeVNode)
      .filter((child) => child !== "" && child != null);

    return {
      type,
      props: props,
      children: normalizedChildren,
    };
  }

  return vNode;
}
