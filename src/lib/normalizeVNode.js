export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  } else if (typeof vNode === "string") {
    return vNode;
  } else if (typeof vNode === "number") {
    return vNode.toString();
  } else if (typeof vNode.type === "function") {
    const renderedVNode = vNode.type({
      ...vNode.props,
      children: vNode.props?.children,
    });
    return normalizeVNode(renderedVNode);
  } else {
    const { type, props = {} } = vNode;
    const childArray = Array.isArray(props.children)
      ? props.children
      : [props.children];

    const normalizedChildren = childArray.map((child) => normalizeVNode(child)); // ['']

    // normalizedChildren[renderedVNode];

    return {
      type,
      props,
      children: normalizedChildren,
    };
  }
}

// props: {
//   ...props,
//   children: [normalizedChildren],
//   className: props.className,
// }
// .filter(
//   (normalizedChild) =>
//     normalizedChild !== null &&
//     normalizedChild !== "undefined" &&
//     normalizedChild,
// )
