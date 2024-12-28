import { isRenderableVNode, isTextNode } from "../utils/domUtils";

export function normalizeVNode(vNode) {
  if (!isRenderableVNode(vNode)) {
    return "";
  }

  if (isTextNode(vNode)) {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const newVNode = normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
    return newVNode;
  }

  if (Array.isArray(vNode)) {
    const newvNodes = vNode.map(normalizeVNode);
    return newvNodes;
  }

  const childNodes = vNode.children.map(normalizeVNode);
  return {
    ...vNode,
    children: childNodes,
  };
}
