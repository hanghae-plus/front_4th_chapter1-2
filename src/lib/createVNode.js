export function createVNode(type, props, ...children) {
  const flatChildren = children
    .flat(Infinity)
    .filter(
      (child) => child !== null && child !== undefined && child !== false,
    ); // falsy 값 제거

  return { type, props, children: flatChildren };
}
