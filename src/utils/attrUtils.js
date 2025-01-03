import { addEvent, removeEvent } from "../lib/eventManager";

/**
 * 요소의 속성과 이벤트를 업데이트하는 함수.
 *
 * @param element - 업데이트할 DOM 요소
 * @param oldProps - 이전 속성 객체
 * @param newProps - 새로운 속성 객체
 * @note
 * - style 속성은 객체로 전달되면 기존 스타일과 병합됩니다.
 * - on.. 형식의 이벤트 속성은 이벤트 핸들러로 간주되어, DOM에 등록/제거됩니다.
 */
export const handleUpdateAttr = (target, originNewProps, originOldProps) => {
  if (!originOldProps && !originNewProps) return;

  const newProps = originNewProps ?? {};
  const oldProps = originOldProps ?? {};

  // 속성 제거 처리
  Object.keys(oldProps).forEach((attr) => {
    if (!newProps[attr]) {
      if (isEventAttribute(oldProps, attr)) {
        removeEvent(target, getEventType(attr), oldProps[attr]);
      } else if (attr === "className") {
        target.removeAttribute("class");
      } else {
        target?.removeAttribute(attr);
      }
    }
  });

  // 속성 추가/갱신 처리
  Object.keys(newProps).forEach((attr) => {
    if (oldProps[attr] !== newProps[attr]) {
      if (isEventAttribute(newProps, attr)) {
        if (isEventAttribute(oldProps, attr)) {
          // 기존 핸들러도 함수고 새로운 핸들러도 함수면 기존 핸들러를 제거
          removeEvent(target, getEventType(attr), oldProps[attr]);
        }
        addEvent(target, getEventType(attr), newProps[attr]);
      } else if (attr === "className") {
        target.setAttribute("class", newProps[attr]);
      } else if (attr === "style" && typeof newProps[attr] === "object") {
        // 필요한 부분만 변경
        Object.assign(target[attr], newProps[attr]);
      } else {
        target.setAttribute(attr, newProps[attr]);
      }
    }
  });
};

/**
 * 주어진 속성이 이벤트 핸들러인지 확인.
 *
 * @param {Object} props - 속성이 포함된 객체 (주로 `props`).
 * @param {string} attr - 확인할 속성의 이름.
 * @returns {boolean} - 속성이 이벤트 핸들러(`on*` 형식)이고 함수인지 여부.
 * @description
 * - 속성 이름이 "on"으로 시작하고 해당 값이 함수일 경우, true를 반환.
 * - 주로 DOM 이벤트 핸들러를 식별하는 데 사용됨.
 */
function isEventAttribute(props, attr) {
  return attr.startsWith("on") && typeof props[attr] === "function";
}

/**
 * 이벤트 속성 이름에서 이벤트 타입 추출.
 *
 * @param {string} attr - 이벤트 속성 이름 (예: "onClick").
 * @returns {string} - 이벤트 타입 이름 (예: "click").
 * @description
 * - 속성 이름에서 "on" 접두사를 제거하고, 소문자로 변환하여 이벤트 타입 반환.
 * - 예: "onClick" → "click", "onMouseOver" → "mouseover".
 */
function getEventType(attr) {
  return attr.slice(2).toLowerCase();
}
