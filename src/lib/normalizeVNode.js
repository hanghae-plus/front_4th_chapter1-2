export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    vNode = "";
  }

  if (typeof vNode === "number") {
    vNode = vNode.toString();
  }

  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    const refinedProps = vNode.props || {};

    vNode = normalizeVNode(
      Component({
        ...refinedProps,
        children: vNode.children,
      }),
    );
  }

  if (typeof vNode === "object") {
    const { children } = vNode;

    if (Array.isArray(children)) {
      vNode.children = children
        .filter((child) => child !== true)
        .map(normalizeVNode);
    }
  }

  return vNode;
}
