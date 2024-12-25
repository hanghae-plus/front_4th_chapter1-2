export function createElement(vNode) {
  if (typeof vNode === "function") {
    throw new Error("Cannot create element from component");
  }

  // falsy 값들 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // string 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    console.log("hello");
    // throw new Error("Cannot create element from component");
  }

  // 객체일 경우
  const element = document.createElement(vNode.type);

  // 속성 설정
  if (vNode.props) {
    Object.entries(vNode.props).forEach(([name, value]) => {
      // className은 class로 변경 (tailwindcss 때문)
      const attributeName = name === "className" ? "class" : name;
      element.setAttribute(attributeName, value);
    });
  }

  // 자식노드가 있을 경우 재귀적으로 호출
  // 일반함수를 사용해서 this 바인딩
  if (vNode.children) {
    vNode.children
      .filter((child) => child !== undefined) // undefined 자식 필터링
      .map(createElement)
      .forEach((child) => element.appendChild(child));
  }

  // 화살표 함수 사용 시 this 제외 가능
  // node.children.map(createDOM).forEach((child) => element.appendChild(child));

  return element;
}

// function updateAttributes($el, props) {}
