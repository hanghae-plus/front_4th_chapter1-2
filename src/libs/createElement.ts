import { VNode, VNodeProps } from "../types";
import { updateAttributes } from "./updateAttributes";

/**
 * Virtual DOM Node를 실제 DOM Element로 변환하는 함수
 * @param vNode - Virtual DOM Node, 문자열 또는 기타 타입
 * @returns HTMLElement, Text Node 또는 DocumentFragment
 */
export function createElement(vNode: VNode | any) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  const element = document.createElement(vNode.type);

  updateAttributes(element, vNode.props);

  const children = [
    ...(vNode.props?.children || []),
    ...(vNode.children || []),
  ];

  children.forEach((child) => {
    if (child != null) {
      element.appendChild(createElement(child));
    }
  });

  return element;
}
