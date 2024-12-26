export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((v) => v !== null && typeof v !== "undefined" && v !== false),
  };
}
