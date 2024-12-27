export function createVNode(type, props, ...children) {
  const flattenedChildren = children
    .flat()
    .filter((child) => child || child === 0);

  return {
    type,
    props,
    children: flattenedChildren.flat(),
  };
}
