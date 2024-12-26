export function createVNode(type, props, ...children) {
  const flattenChildren = (children) =>
    children.reduce((acc, child) => {
      if (Array.isArray(child)) {
        return acc.concat(flattenChildren(child)); // 재귀적으로 평탄화
      }
      if (child !== null && child !== undefined) {
        return acc.concat(child);
      }
      return acc;
    }, []);

  return {
    type,
    props,
    children: flattenChildren(children).filter((child) => child || child === 0),
  };
}
