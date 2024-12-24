export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter((item) => {
      if (item === 0) return true;
      if (!item) return false;
      return true;
    }),
  };
}
