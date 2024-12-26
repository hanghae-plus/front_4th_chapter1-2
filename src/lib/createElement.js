import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // vNode가 null, undefined, boolean 면 빈 텍스트 노드를 반환.
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가.
  if (Array.isArray(vNode)) {
    const docFragment = document.createDocumentFragment();

    vNode.forEach((el) => docFragment.appendChild(createElement(el)));

    return docFragment;
  }

  // 4. 위 경우가 아니면 실제 DOM 요소를 생성.
  // - vNode.type에 해당하는 요소를 생성
  const element = document.createElement(vNode.type);
  // - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
  updateAttributes(element, vNode.props || {}); // props: { id: '' , ... }
  // - vNode.children의 "각 자식"에 대해 createElement를 재귀 호출하여 추가
  element.append(...vNode.children.map(createElement));

  return element;
}

// vNode.props의 속성들을 적용. (이벤트 리스너, className, 일반 속성 등 처리)
function updateAttributes($el, props) {
  Object.entries(props).forEach(([attr, value]) => {
    if (attr.startsWith("on") && typeof value === "function") {
      addEvent($el, attr.slice(2).toLowerCase(), value);
      return;
    } else if (attr === "className") {
      $el.setAttribute("class", value);
      return;
    } else {
      $el.setAttribute(attr, value);
    }
  });
}
