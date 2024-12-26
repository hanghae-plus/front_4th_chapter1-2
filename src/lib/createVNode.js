export function createVNode(type, props, ...children) {
  const flatChildren = children
    .flatMap((child) => (child instanceof Array ? child.flat() : child))
    .filter(
      (child) =>
        child !== false &&
        child !== null &&
        child !== undefined &&
        child !== "" &&
        child !== true,
    );

  return {
    type,
    props,
    children: flatChildren,
  };
}

// <div id="test" className="old">
// Hello
// </div>

// const test = createVNode("div", { id: "test", className: "old" }, "Hello");

// console.log(test);
