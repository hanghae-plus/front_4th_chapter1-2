export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((child) => (child === 0 ? true : Boolean(child))),
  };
}
