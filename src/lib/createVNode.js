export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.filter((child) => (child === 0 || child ? true : false)),
  };
}
