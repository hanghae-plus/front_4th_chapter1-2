export function createVNode(type, props, ...children) {
  if (props === null) {
    props = null;
  }

  children = children
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null && typeof child !== "undefined" && child !== false,
    );
  return { type, props, children };
}
