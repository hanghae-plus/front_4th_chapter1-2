export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    // null, undefined, boolean인 경우 빈 텍스트 노드 반환
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    // 문자열이나 숫자인 경우 텍스트 노드 생성
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    // 배열인 경우 DocumentFragment 생성 및 자식 요소 추가
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  if (typeof vNode === "object" && vNode !== null) {
    // 객체인 경우 실제 DOM 요소 생성
    const $el = document.createElement(vNode.type);

    // props 처리
    if (vNode.props) {
      updateAttributes($el, vNode.props);
    }

    // children 처리
    if (vNode.children) {
      vNode.children.forEach((child) => {
        $el.appendChild(createElement(child));
      });
    }

    return $el;
  }

  // 기본적으로 빈 텍스트 노드 반환
  return document.createTextNode("");
}

function updateAttributes($el, props) {
  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      // 이벤트 리스너 처리
      const event = key.slice(2).toLowerCase();
      $el.addEventListener(event, props[key]);
    } else if (key === "className") {
      // className 처리
      $el.className = props[key];
    } else {
      // 일반 속성 처리
      $el.setAttribute(key, props[key]);
    }
  }
}
