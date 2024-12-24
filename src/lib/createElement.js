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

  // vNode.type에 해당하는 HTML 요소를 생성
  const $el = document.createElement(vNode.type);

  if (vNode.props) {
    // props를 순회하며 이벤트 리스너 추가 및 속성 설정
    Object.entries(vNode.props).forEach(([key, value]) => {
      // 클래스 이름 설정
      if (key === "className") {
        $el.classList = value;
        return;
      }
      if (key.startsWith("on")) {
        const eventType = key.toLowerCase().slice(2);
        // 이벤트 추가
        addEvent($el, eventType, value);
        return;
      }
      // 속성 설정
      $el.setAttribute(key, value);
    });
  }

  if (vNode.children) {
    // children 배열 순회하여 각 자식을 createElement로 처리 후 부모 노드에 추가
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      $el.append(childElement);
    });
  }
  return $el;
}
