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
    const vNodoes = vNode.map(normalizeVNode);
    return vNodoes;
  }

  const childNodes = vNode.children.map(normalizeVNode);
  return {
    ...vNode,
    children: childNodes,
  };
}
