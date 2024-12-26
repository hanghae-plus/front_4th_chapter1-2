function updateAttributes(element, props) {
  props = props || {}; // props가 undefined일 경우 빈 객체로 설정

  for (const key in props) {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      // 이벤트 핸들러
      element.addEventListener(eventType, props[key]);
    } else {
      // 일반 속성 설정
      if (key === "className") {
        element.className = props[key]; // className 처리
      } else {
        element.setAttribute(key, props[key]); // 일반 속성 처리
      }
    }
  }
}

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode(""); // 빈 텍스트 노드 생성
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode)); // 텍스트 노드 생성
  }

  // 배열 입력 처리: DocumentFragment 생성
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((childVNode) => {
      fragment.appendChild(createElement(childVNode)); // 각 요소를 DocumentFragment에 추가
    });
    return fragment; // DocumentFragment 반환
  }

  const element = document.createElement(vNode.type);

  // props 설정
  updateAttributes(element, vNode.props);

  // 자식 노드 추가
  vNode.children.forEach((child) => {
    element.appendChild(createElement(child)); // 재귀적으로 자식 요소 생성
  });

  return element;
}
