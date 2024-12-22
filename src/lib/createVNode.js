export function createVNode(type, props, ...children) {
  const flatChildren = children
    .flat(Infinity)
    .filter((child) => child || child === 0);

  return {
    type,
    props: props || null,
    children: flatChildren,
  };
}
