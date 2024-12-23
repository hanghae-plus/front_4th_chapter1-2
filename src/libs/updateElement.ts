import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { VNode, VNodeProps } from "../types";

/**
 * DOM Element의 속성을 비교하여 업데이트하는 함수
 * @param target - 업데이트할 DOM Element
 * @param newProps - 새로운 속성들
 * @param oldProps - 이전 속성들
 */
function updateAttributes(
  target: HTMLElement,
  newProps: VNodeProps = {},
  oldProps: VNodeProps = {},
) {
  Object.keys(oldProps).forEach((prop) => {
    if (prop === "children") return;

    if (prop.startsWith("on")) {
      const eventType = prop.substring(2).toLowerCase();
      removeEvent(target, eventType, oldProps[prop]);
    } else if (!(prop in newProps)) {
      target.removeAttribute(prop);
    }
  });

  Object.keys(newProps).forEach((prop) => {
    if (prop === "children") return;

    if (prop.startsWith("on")) {
      const eventType = prop.substring(2).toLowerCase();
      addEvent(target, eventType, newProps[prop]);
    } else if (oldProps[prop] !== newProps[prop]) {
      if (newProps[prop]) {
        target.setAttribute(prop, newProps[prop]);
      }
    }
  });
}

/**
 * Virtual DOM의 변경사항을 실제 DOM에 반영하는 함수
 * @param parentElement - 부모 DOM Element
 * @param newNode - 새로운 Virtual Node
 * @param oldNode - 이전 Virtual Node
 * @param index - 자식 노드의 인덱스
 */
export function updateElement(
  parentElement: HTMLElement,
  newNode: VNode | string | null,
  oldNode: VNode | string | null,
  index: number = 0,
) {
  if (!newNode && !oldNode) {
    return;
  }

  if (!newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (!oldNode) {
    if (typeof newNode === "string") {
      parentElement.appendChild(document.createTextNode(newNode));
    } else if (newNode) {
      parentElement.appendChild(createElement(newNode));
    }
    return;
  }

  // 둘 다 문자열인 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.replaceChild(
        document.createTextNode(newNode),
        parentElement.childNodes[index],
      );
    }
  }

  // 둘 중 하나는 VNode, 하나는 문자열인 경우
  if (typeof newNode !== typeof oldNode) {
    if (typeof newNode === "string") {
      parentElement.replaceChild(
        document.createTextNode(newNode),
        parentElement.childNodes[index],
      );
    } else {
      parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  // VNode인 경우 - 타입이 같은 경우
  if (typeof newNode !== "string" && typeof oldNode !== "string") {
    if (newNode.type === oldNode.type) {
      updateAttributes(
        parentElement.childNodes[index] as HTMLElement,
        newNode.props,
        oldNode.props,
      );

      const newLength = newNode.props.children?.length || 0;
      const oldLength = oldNode.props.children?.length || 0;
      const maxLength = Math.max(newLength, oldLength);

      for (let i = 0; i < maxLength; i++) {
        // 재귀적으로 업데이트
        updateElement(
          parentElement.childNodes[index] as HTMLElement,
          newNode.props.children?.[i] || null,
          oldNode.props.children?.[i] || null,
          i,
        );
      }
    } else {
      // VNode인 경우 - 타입이 다른 경우
      parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    }
  }
}
