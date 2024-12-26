import { createElement } from "./createElement";
import { addEvent, removeEvent } from "./eventManager";

const TEXT_NODE = 3;

interface VNode {
  type: string | Function;
  props: Record<string, any>;
  children?: Array<VNode | string | number>;
}

export function updateElement(
  parentElement: HTMLElement,
  newVNode: VNode,
  oldVNode: VNode,
  index = 0,
) {
  // 실제 DOM 노드 (업데이트 대상)
  const domNode = parentElement.childNodes[index] as HTMLElement;

  // 기본 케이스 처리
  if (!oldVNode && newVNode) {
    parentElement.appendChild(createElement(newVNode));
    return;
  }

  if (!newVNode) {
    parentElement.removeChild(domNode);
    return;
  }

  // 텍스트 노드 처리
  if (typeof newVNode === "string" || typeof newVNode === "number") {
    if (domNode.nodeType === TEXT_NODE) {
      if (domNode.textContent !== String(newVNode)) {
        domNode.textContent = String(newVNode);
      }
    } else {
      parentElement.replaceChild(
        document.createTextNode(String(newVNode)),
        domNode,
      );
    }
    return;
  }

  // 함수형 컴포넌트 처리
  if (typeof newVNode.type === "function") {
    const newComponent = newVNode.type(newVNode.props);
    updateElement(parentElement, newComponent, oldVNode, index);
    return;
  }

  // 노드 타입이 다르면 완전히 교체
  if (oldVNode.type !== newVNode.type) {
    parentElement.replaceChild(createElement(newVNode), domNode);
    return;
  }

  // 속성 업데이트
  updateAttributes(domNode, newVNode.props || {}, oldVNode.props || {});

  // 자식 노드들 재귀적으로 업데이트
  const newChildren = newVNode.children || [];
  const oldChildren = oldVNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(domNode, newChildren[i] as VNode, oldChildren[i] as VNode, i);
  }
}

function updateAttributes(
  target: HTMLElement,
  newProps: Record<string, any>,
  oldProps: Record<string, any>,
) {
  // 이전 속성 제거
  for (const key in oldProps) {
    if (!(key in newProps)) {
      if (key.startsWith("on")) {
        const eventName = key.toLowerCase().substring(2);
        removeEvent(target, eventName);
      } else {
        target.removeAttribute(key === "className" ? "class" : key);
      }
    }
  }

  // 새로운 속성 설정 또는 업데이트
  for (const key in newProps) {
    const oldValue = oldProps[key];
    const newValue = newProps[key];

    if (oldValue !== newValue) {
      if (key.startsWith("on")) {
        const eventName = key.toLowerCase().substring(2);
        if (oldValue) {
          removeEvent(target, eventName);
        }
        if (newValue) {
          addEvent(target, eventName, newValue);
        }
      } else {
        if (key === "className") {
          target.setAttribute("class", newValue);
        } else {
          target.setAttribute(key, newValue);
        }
      }
    }
  }
}
