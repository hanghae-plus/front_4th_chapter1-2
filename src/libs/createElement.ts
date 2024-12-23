import { VNode, VNodeProps } from "../types";
import { addEvent } from "./eventManager";

/**
 * Virtual DOM Node를 실제 DOM Element로 변환하는 함수
 * @param vNode - Virtual DOM Node 또는 문자열
 * @returns HTMLElement 또는 Text Node
 */

export function createElement(vNode: VNode) {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  const element = document.createElement(vNode.type);

  updateAttributes(element, vNode.props);

  vNode.props.children?.forEach((child) => {
    element.appendChild(createElement(child));
  });

  return element;
}

/**
 * DOM Element의 속성을 설정하는 함수
 * @param element - 실제 DOM Element
 * @param props - 설정할 속성들
 */

function updateAttributes(
  element: HTMLElement,
  props: VNodeProps | null,
): void {
  if (!props) {
    return;
  }

  Object.entries(props).forEach(([key, value]) => {
    if (key === "children") return;

    if (key.startsWith("on")) {
      const eventType = key.substring(2).toLowerCase();
      addEvent(element, eventType, value);
      return;
    }

    if (value) {
      element.setAttribute(key, value);
    }
  });
}
