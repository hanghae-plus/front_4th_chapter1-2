export function normalizeVNode(vNode) {
  console.log(vNode);
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  } else if (typeof vNode === "string") {
    return vNode;
  } else if (typeof vNode === "number") {
    return vNode.toString();
  } else if (typeof vNode === "function") {
    const result = vNode();
    return normalizeVNode(result);
  } else {
    return vNode
      .map((child) => normalizeVNode(child))
      .filter(
        (child) =>
          child === null ||
          typeof child === "undefined" ||
          typeof child === "boolean",
      );
  }
}
