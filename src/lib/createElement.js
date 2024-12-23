// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열이면 DocumentFragment로 생성하고 재귀 호출하여 추가
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    // 배열이니까 forEach로 각 요소를 DocumentFragment에 추가
    vNode.forEach((child) => {
      const childNode = createElement(child); // 각 요소를 돔 노드로 변환 (재귀적으로 처리해줌)
      fragment.appendChild(childNode); // DocumentFragment에 추가
    });

    return fragment;
  }

  //위 경우가 아니면 실제 DOM 요소로 변환
  if (typeof vNode === "object" && vNode.type) {
    // vNode가 객체이며, type 속성이 존재하는지 확인
    const { type, props = {}, children = [] } = vNode;

    const element = document.createElement(type);

    // 각 속성을 돔 요소에 추가 => updateAttributes 함수로 update TODO
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith("on") && typeof value === "function") {
        // 이벤트 속성이라고 생각하고 추가
        const eventType = key.slice(2).toLowerCase();
        element.addEventListener(eventType, value);
      } else if (key === "className") {
        // className은 Dom요소의 class 속성으로 설정
        element.className = value;
      } else {
        // 일반 속성 추가
        element.setAttribute(key, value);
      }
    }

    // 자식 노드 추가
    (children.flat ? children.flat(Infinity) : [children]).forEach((child) => {
      const childNode = createElement(child); // 재귀적으로 DOM 노드로 변환
      element.appendChild(childNode);
    });

    return element;
  }
}

// function updateAttributes($el, props) {}
