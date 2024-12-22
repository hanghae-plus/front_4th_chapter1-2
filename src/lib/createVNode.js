export function createVNode(type, props, ...children) {
  const filteredVNodeChildren = children
    .flat(Infinity)
    .filter(
      (child) => child !== null && child !== undefined && child !== false,
    );

  const vNode = {
    type,
    props: props || {},
    children: filteredVNodeChildren,
  };

  return vNode;
}
