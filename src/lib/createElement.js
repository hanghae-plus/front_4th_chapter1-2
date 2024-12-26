import { addEvent } from "./eventManager";

//실제 DOM 요소로 변환하는 함수
export function createElement(node) {
  //node가 undefined, null, false, 또는 true인 경우에는 빈 텍스트 노드 document.createTextNode("")를 생성하여 반환
  if (node === undefined || node === null || node === false || node === true) {
    return document.createTextNode("");
  }

  //node가 문자열(string)이나 숫자(number)인 경우에는 텍스트 노드를 생성하여 반환
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(node);
  }

  //node가 배열이면 fragment를 생성하여 node의 각 항목을 createElement로 처리하고, 그 결과를 fragment에 추가하여 fragment를 반환
  if (Array.isArray(node)) {
    const fragment = document.createDocumentFragment();

    node.forEach((child) => {
      fragment.appendChild(createElement(child));
    });

    return fragment;
  }

  //node가 배열이나 텍스트 노드가 아닌 경우, node.type에 해당하는 HTML 태그를 생성
  const element = document.createElement(node.type);

  //node.props에 포함된 속성들을 하나씩 순회하며, HTML 속성으로 설정
  updateAttributes(element, node.props);

  // node.children은 node의 자식 요소들을 배열 형태를 가지고있기때문에 각 자식 요소에 대해 createElement 함수를 호출하여 자식 요소들을 실제 DOM으로 변환
  const children = node.children.map((child) => createElement(child));
  //children 배열에 들어 있는 각 자식 요소들을 element.appendChild(child)를 통해 부모 요소(element)에 자식으로 추가
  children.forEach((child) => element.appendChild(child));

  return element;
}

function updateAttributes(element, props) {
  Object.entries(props || {}).forEach(([attr, value]) => {
    if (attr.startsWith("on") || typeof value === "function") {
      addEvent(element, attr.slice(2).toLowerCase(), value);
    } else if (attr === "className") {
      element.setAttribute("class", value);
    } else {
      element.setAttribute(attr, value);
    }
  });
}
