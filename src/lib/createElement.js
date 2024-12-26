import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 예외처리 로직
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return document.createTextNode("");
  if (typeof vNode === "string" || typeof vNode === "number")
    return document.createTextNode(vNode.toString());

  // 요소가 배열로 들어올 때,
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });

    return fragment;
  }

  const { type, props, children } = vNode;
  const $el = document.createElement(type);

  // children 처리
  if (Array.isArray(children)) {
    children
      .filter(
        (child) =>
          child !== undefined &&
          child !== null &&
          child !== false &&
          child !== true,
      )
      .map(createElement)
      .forEach((child) => $el.appendChild(child)); // 자식 노드를 부모 노드에 추가
  }

  Object.entries(props || {}).forEach(([k, v]) =>
    setElementAttribute($el, k, v),
  );

  return $el;
}

export const setElementAttribute = (element, key, value) => {
  if (key.startsWith("on")) {
    addEvent(element, key.slice(2).toLowerCase(), value); // 이벤트를 저장한다
  } else {
    // if (typeof value === "function")   console.log("Sdfsdf")
    if (key === "className") {
      element.setAttribute("class", value);
    } else {
      element.setAttribute(key, value); // 일반 속성 처리
    }
  }
};
