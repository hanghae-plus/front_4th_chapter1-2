export function createVNode(type, props, ...children) {
  const filteredVNodeChildren = children
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null &&
        child !== undefined &&
        child !== false &&
        child !== true,
    );

  const vNode = {
    type,
    props,
    children: filteredVNodeChildren,
  };

  return vNode;
}
