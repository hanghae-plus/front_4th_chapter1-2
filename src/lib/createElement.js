// import { addEvent } from "./eventManager";

import { addEvent } from "./eventManager";

/**
 *
 * @param {*} vNode
 * @returns Element
 *
 * vDom 을 -> dom 으로 변환하는 함수
 *
 * type : element 를 생성하기 위한 데이터
 * props : element 의 속성을 추가하기 위한 데이터
 * children : element의 자식의 vDom
 */
export function createElement(vNode) {
  // 배열 객체에 대한 document fragment 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    const children = vNode.filter((v) => v).map(createElement);
    children.forEach((v) => fragment.appendChild(v));

    return fragment;
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    // vNode가 text 일 때
    return document.createTextNode(vNode);
  } else if (!vNode || typeof vNode === "boolean") {
    // vNode 가 유효한 데이터가 아닐때
    return document.createTextNode("");
  } else if (typeof vNode.type === "function") {
    //vNode.type이 function 일때
    throw new Error();
    // const vNodeFn = vNode.type({ children: vNode.children, ...vNode.props });
    // return createElement(vNodeFn);
  }

  // tag에 대한 element를 만든다
  const $el = document.createElement(vNode.type);

  // tag의 props 데이터 setting
  Object.entries(vNode.props || {})
    .filter(([_, value]) => value) // eslint-disable-line no-unused-vars
    .forEach(([attr, value]) => {
      if (attr.startsWith("on")) {
        // on 이벤트 root 위임
        const eventType = attr.toLowerCase().substring(2);
        addEvent($el, eventType, value);
      } else if (attr === "className") {
        //className => class 로 속성 넣기
        $el.setAttribute("class", value);
      } else {
        $el.setAttribute(attr, value);
      }
    });

  // vNode의 children 을 재귀호출을 통해 dom 으로 구현
  // map을 통해 순회처리
  const children = vNode.children.filter((v) => v).map(createElement);

  // $el에 변환된 children dom 을 추가한다.
  children.forEach((child) => $el.appendChild(child));

  return $el;
}

// function updateAttributes($el, props) {}
