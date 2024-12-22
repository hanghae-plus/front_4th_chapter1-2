// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return document.createTextNode("");
  } else if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  } else if (typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  } else if (Array.isArray(vNode)) {
    // DocumentFragment 생성
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const $e1 = document.createElement(child.type);
      fragment.appendChild($e1);
    });
    return fragment;
  } else {
    const type = vNode.type;
    const props = vNode.props;
    // const children = vNode.children;
    const $e1 = document.createElement(type);

    // props -> attributes
    for (const [key, value] of Object.entries(props)) {
      // 이벤트 리스너(onclick), className, 일반 속성 등..
      if (key === "className") {
        $e1.className = value;
      } else if (typeof key === "function") {
        // addEvent(key, value, handler);
      }
    }
  }
}

// function updateAttributes($el, props) {}
