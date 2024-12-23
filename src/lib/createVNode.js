export function createVNode(type, props, ...children) {
  if (Array.isArray(children)) {
    children = flatArray(children);
  }

  return {
    type,
    props,
    children,
  };
}

function flatArray(array) {
  return array.reduce((previous, current) => {
    if (Array.isArray(current)) {
      return previous.concat(flatArray(current));
    }

    if (
      current &&
      typeof current === "object" &&
      Object.keys(current).length === 0
    ) {
      return previous;
    }

    if (current || current === 0) {
      return previous.concat(current);
    }

    return previous;
  }, []);
}
