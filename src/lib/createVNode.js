export function createVNode(type, props, ...children) {
  return {
    type,
    props: props || null,
    children: children.flat(Infinity).filter((child) => child || child === 0),
  };
}
