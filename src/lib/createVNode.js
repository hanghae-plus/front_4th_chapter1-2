export function createVNode(type, props, ...children) {
  const flatInfinity = children
    .flat(Infinity)
    .filter(
      (child) => child !== false && child !== null && child !== undefined,
    );

  if (typeof type === "function") {
    return type({ ...props, children: flatInfinity });
  }

  return {
    type,
    props,
    children: flatInfinity,
  };
}
