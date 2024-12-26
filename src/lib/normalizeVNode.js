export function normalizeVNode(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return ""; // Ignore falsy values like null, false, and undefined
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode); // If the node is a string or number, return it as a string
  }

  // Handle function components (like TestComponent, UnorderedList, ListItem)
  if (typeof vNode.type === "function") {
    const props = vNode.props || {};
    const children = vNode.children || [];

    // If it's a component, normalize its children as well
    const normalizedChildren = children
      .map(normalizeVNode)
      .filter(
        (child) =>
          child !== false &&
          child !== null &&
          child !== undefined &&
          child !== "",
      );

    // Return a new vnode with normalized children
    return normalizeVNode(
      vNode.type({ ...props, children: normalizedChildren }),
    );
  }

  // Handle array of children for nodes (like <ul> or <li>)
  if (Array.isArray(vNode.children)) {
    const normalizedChildren = vNode.children
      .map(normalizeVNode)
      .filter(
        (child) =>
          child !== false &&
          child !== null &&
          child !== undefined &&
          child !== "",
      );

    // Return the original vnode with normalized children
    return {
      ...vNode,
      children: normalizedChildren,
    };
  }

  return vNode; // Return the vnode unchanged if it's a plain element
}
