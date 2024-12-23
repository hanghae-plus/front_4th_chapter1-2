export function createVNode(type, props, ...children) {
  // children = children.flat(Infinity);
  return {
    type,
    props,
    children: children.flat(Infinity).filter((value) => {
      if (value) {
        return true;
      } else if (typeof value == "number" || typeof value == "string") {
        return true;
      }
      return false;
    }),
  };
}
