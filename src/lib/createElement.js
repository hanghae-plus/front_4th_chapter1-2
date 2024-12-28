import { addEvent } from "./eventManager";
import { isInvalidValue } from "./helpers";

export function createElement(vNode) {
  if (isInvalidValue(vNode)) {
    return document.createTextNode("");
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    vNode.forEach((value) => $fragment.append(createElement(value)));
    return $fragment;
  }

  if (typeof vNode === "object" && typeof vNode.type === "function") {
    throw new Error("컴포넌트는 `createElement()`로 처리할 수 없습니다.");
  }

  const { type, props, children } = vNode;
  const $el = document.createElement(type);

  updateAttributes($el, props);

  const elements = children.map(createElement);
  elements.forEach((child) => $el.appendChild(child));

  return $el;
}

// Utils
function updateAttributes($el, props) {
  Object.entries(props || {}).forEach(([key, value]) => {
    // 스타일 속성 처리
    if (key === "style") {
      $el.style = value;
      return;
    }

    // 클래스 속성 처리
    if (key === "className") {
      $el.setAttribute("class", value);
      return;
    }

    // 이벤트 핸들러 처리
    if (key.startsWith("on") && typeof value === "function") {
      addEvent($el, key.slice(2).toLowerCase(), value);
      return;
    }

    // 나머지 속성 처리
    $el.setAttribute(key, value);
  });
}
