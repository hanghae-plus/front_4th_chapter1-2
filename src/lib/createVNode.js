export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter((value) => {
      if (value && typeof value != "boolean") {
        return true;
      } else if (typeof value == "number" || typeof value == "string") {
        return true;
      }
      return false;
    }),
  };
}
