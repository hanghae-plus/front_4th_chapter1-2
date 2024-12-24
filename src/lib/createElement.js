import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // vNode가 null, undefined, boolean 면 빈 텍스트 노드를 반환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((node) => fragment.append(createElement(node))); // 재귀 호출
    return fragment;
  }

  // - vNode.type에 해당하는 요소를 생성
  const $el = document.createElement(vNode.type);

  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      if (key === "className") {
        $el.classList = value;
        return;
      }
      if (key.startsWith("on")) {
        const eventType = key.toLowerCase().slice(2);
        addEvent($el, eventType, value);
        return;
      }
      $el.setAttribute(key, value);
    });
  }

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      $el.append(childElement);
    });
  }
  return $el;
}

// function updateAttributes($el, props) {
//   Object.entries(props).forEach(([attr, value]) => {
//     if (attr.startsWith("on") && typeof value === "function") {
//       const eventType = attr.toLowerCase().slice(2);
//       addEvent($el, eventType, value);
//     }
//   });
// }
