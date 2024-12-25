export function createElement(vNode) {
  //빈 텍스트 노드로 변환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  //텍스트 노드로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  //배열 입력에 대해 DocumentFragment 생성
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  //vNode.type을 기반으로 실제 dom에 element생성
  const { type, props, children } = vNode;
  const element = document.createElement(type);

  updateAttributes(element, props);
  element.append(...Array.from(children).map(createElement));

  return element;
}

export function updateAttributes($el, props) {
  if (props && typeof props === "object") {
    //Object.keys() 정적 메서드는 주어진 객체 자체의 열거 가능한 문자열 키를 가진 속성들의 이름을 배열로 반환
    Object.keys(props).forEach((key) => {
      if (key === "className") {
        $el.setAttribute("class", props[key]);
        return;
      }

      $el.setAttribute(key, props[key]);
    });
  }
}
