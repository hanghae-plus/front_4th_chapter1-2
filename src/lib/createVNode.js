const flattenChildren = (items) => {
  {
    return items.flat(Infinity).filter((child) => {
      return (
        child !== null &&
        child !== undefined &&
        child !== false &&
        child !== true
      );
    });
  }
};

export function createVNode(type, props, ...children) {
  return {
    type,
    props: props,
    children: flattenChildren(children),
  };
}
