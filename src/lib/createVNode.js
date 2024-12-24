export function createVNode(type, props, ...children) {
  children = children
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null && typeof child !== "undefined" && child !== false,
    );
  return { type, props, children };
}
