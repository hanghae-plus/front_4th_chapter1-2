function updateAttributes($el, props) {
  if (props) {
    // className 처리
    if (props.className) {
      $el.className = props.className;
    }

    // 일반 속성 처리
    // for (let key in props) {
    //   if (props.hasOwnProperty(key) && key !== "className" && key !== "children") {
    //     if (key.startsWith("on")) {
    //       const eventType = key.slice(2).toLowerCase(); // onClick -> click
    //       addEvent($el, eventType, props[key]);
    //     } else {
    //       // 일반 속성 처리
    //       $el.setAttribute(key, props[key]);
    //     }
    //   }
    // }
  }
}

export function createElement(vNode) {
  // vNode가 null, undefined, boolean 면 빈 텍스트 노드를 반환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    // vNode.forEach( (child) => {
    //   fragment.appendChild(createElement(child));
    // });
    vNode.forEach((child) => fragment.appendChild(createElement(child))); // 자식 요소 추가
    return fragment;
  }

  // 위 경우가 아니면 실제 DOM 요소를 생성
  if (typeof vNode === "object" && vNode.type) {
    // - vNode.type에 해당하는 요소를 생성
    const $el = document.createElement(vNode.type);

    // - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
    updateAttributes($el, vNode.props);

    // - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
    if (vNode.children) {
      vNode.children.forEach((child) => {
        $el.appendChild(createElement(child));
      });
    }

    return $el;
  }

  // vNode가 객체가 아닌 경우, 그대로 반환
  return vNode;
}
