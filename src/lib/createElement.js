//import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // undifined, null, boolean은 빈텍스트 노드로 변환
  if (
    typeof vNode === "boolean" ||
    vNode === null ||
    typeof vNode === "undefined"
  ) {
    return document.createTextNode("");
  }

  //string과 number은 텍스트 노드로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // vNode가 배열일 때 fragment로 리턴
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((node) => {
      console.log("test", node);
      fragment.append(createElement(node));
    });
    return fragment;
  }
  // 컴포넌트를 createElement로 처리하려고 하면 오류 발생
  if (typeof vNode === "object" && typeof vNode === "function") {
    throw new Error("error");
  }

  //컴포넌트 정규화
  const { type, props, children } = vNode;
  const $el = document.createElement(type);
  updateAttributes($el, props);

  if (children) {
    children.forEach((child) => {
      const childElement = createElement(child);
      $el.append(childElement);
    });
  }
  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props || {}).forEach(([key, value]) => {
    if (key === "className") {
      $el.classList = value;
      return;
    }
    $el.setAttribute(key, value);
  });
}
