import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  } else if (typeof vNode === "number" || typeof vNode === "string") {
    return document.createTextNode(vNode.toString());
  } else if (Array.isArray(vNode)) {
    const parentComponent = document.createDocumentFragment();
    vNode.forEach((vN) => parentComponent.appendChild(createElement(vN)));
    return parentComponent;
  }

  /* vNode를 컴포넌트로 바꾸는 과정입니다 */
  // 일반 Object 형태의 컴포넌트인 경우
  // console.log("vNode", vNode);
  // vNode.type에 맞게 해당 타입으로 컴포넌트 하나 생성
  const component = document.createElement(vNode.type);

  // vNode에 있는 props로 component
  updateAttributes(component, vNode.props);
  // component의 자식들을 creatElement재귀를 돌려서 appendChild시키기
  vNode.children.forEach((child) => {
    component.appendChild(createElement(child));
  });
  // 최종 컴포넌트 리턴
  return component;
}
/* create할 떄 attribute값을 업데이트 해주는 함수 */
function updateAttributes($el, props) {
  // props 값이 존재해야만 할 수 있음
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      // 이벤트 함수인 경우
      if (key.startsWith("on") && typeof value === "function") {
        const eventType = key.toLowerCase().slice(2); // on 글자 제외
        addEvent($el, eventType, value); // 이벤트를 등록하기. 등록하고자 하는 컴포넌트, 이벤트 타입, 이벤트시 실행될 함수
      } else if (key === "className") {
        // 스타일 적용하기
        $el.setAttribute("class", value);
      } else {
        // 나머지 id 값 등
        $el.setAttribute(key, value);
      }
    });
  }
}
