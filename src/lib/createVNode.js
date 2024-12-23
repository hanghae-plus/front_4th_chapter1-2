export function createVNode(type, props, ...children) {
  const flatChildren = children.flat(Infinity);

  const processedChildren = flatChildren
    .map((child) => {
      if (child === null || child === undefined || child === false) {
        return null;
      }

      if (typeof child === "object" && child.type) {
        const childChildren = Array.isArray(child.children)
          ? child.children
          : [];

        return createVNode(child.type, child.props || null, ...childChildren);
      }

      return child;
    })
    .filter((child) => child != null);

  return {
    type,
    props: props || null,
    children: processedChildren,
  };
}
