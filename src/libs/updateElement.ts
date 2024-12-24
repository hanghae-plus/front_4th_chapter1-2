import { createElement } from "./createElement.js";
import { VNode, VNodeChild, VNodeProps } from "../types";
import { updateAttributes } from "./updateAttributes";

/**
 * Virtual DOM의 변경사항을 실제 DOM에 반영하는 함수
 * @param parentElement - 부모 DOM Element
 * @param newNode - 새로운 Virtual Node
 * @param oldNode - 이전 Virtual Node
 * @param index - 자식 노드의 인덱스
 */
export function updateElement(
  parentElement: HTMLElement,
  newNode: VNodeChild,
  oldNode: VNodeChild,
  index: number = 0,
) {
  if (!newNode || typeof newNode === "boolean") {
    if (oldNode != null) {
      parentElement.removeChild(parentElement.childNodes[index]);
    }
    return;
  }

  if (!oldNode || typeof oldNode === "boolean") {
    const newElement =
      typeof newNode === "object"
        ? createElement(newNode)
        : document.createTextNode(String(newNode));
    parentElement.appendChild(newElement);
    return;
  }

  // 원시 타입(string, number) 노드 처리
  if (typeof newNode !== "object") {
    const newValue = String(newNode);
    // 실질적으로 값이 바뀌지 않은 경우
    if (typeof oldNode !== "object" && String(oldNode) === newValue) {
      return;
    }
    parentElement.replaceChild(
      document.createTextNode(newValue),
      parentElement.childNodes[index],
    );
    return;
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

  // 기존 노드가 원시 타입이면 교체
  if (typeof oldNode !== "object") {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // VNode인 경우 - 타입이 같은 경우
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 속성과 자식 노드 업데이트
  const element = parentElement.childNodes[index] as HTMLElement;
  updateAttributes(element, newNode.props || {}, oldNode.props || {});

  // 자식 노드 재귀 업데이트
  const newChildren = [...(newNode.props?.children || []), ...newNode.children];
  const oldChildren = [...(oldNode.props?.children || []), ...oldNode.children];

  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(element, newChildren[i], oldChildren[i], i);
  }
}
