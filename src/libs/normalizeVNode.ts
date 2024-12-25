import { VNode, VNodeChild } from "@types";

/**
 * Virtual Node를 정규화하는 함수
 * @param vNode - 정규화할 Virtual Node
 * @returns 정규화된 Virtual Node
 */
export function normalizeVNode(vNode: VNodeChild): string | VNode {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode === "string") {
    return vNode;
  }

  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    const { children: propChildren, ...restProps } = vNode.props || {};

    const componentChildren = [
      ...(propChildren || []),
      ...(vNode.children || []),
    ];

    const result = Component({
      ...restProps,
      children: componentChildren
        .map((child) => normalizeVNode(child))
        .filter((child) => child !== ""),
    });

    return normalizeVNode(result);
  }

  return {
    type: vNode.type,
    props: vNode.props,
    children: (vNode.children || [])
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== ""),
  };
}
