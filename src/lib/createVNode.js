export function createVNode(type, props, ...children) {
  const flatChildren = children.flat(Infinity);
  const filteredChildren = flatChildren.filter((child) => child || child === 0);

  return { type, props, children: filteredChildren };
}
