export function createVNode(type, props, ...children) {
  console.log("log: ", children);
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          value !== false &&
          value !== "",
      ),
  };
}
