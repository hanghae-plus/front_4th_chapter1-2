export function createVNode(type, props, ...children) {
  const flatChildren = children
    .flat(Infinity)
    .filter((child) => child || child === 0);

  return {
    type,
    props,
    children: flatChildren,
  };
}

const vNode = createVNode(
  "div",
  null,
  createVNode("span", null, "Hello"),
  createVNode("b", null, "world"),
);
console.log(vNode);
