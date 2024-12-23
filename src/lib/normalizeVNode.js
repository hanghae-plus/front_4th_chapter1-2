import { isRenderedVNode, isTextVNode } from "./util";

export function normalizeVNode(vNode) {
  if (!isRenderedVNode(vNode)) {
    return "";
  }

  if (isTextVNode(vNode)) {
    return vNode.toString();
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  return {
    type: vNode.type,
    props: vNode.props,
    children: Array.from(vNode.children).map(normalizeVNode),
  };
}
