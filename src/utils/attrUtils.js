import { addEvent, removeEvent } from "../lib/eventManager";

/**
 * 요소의 속성과 이벤트를 업데이트합니다.
 *
 * @param {HTMLElement} element - 속성을 업데이트할 DOM 요소.
 * @param {Object} oldProps - 이전 속성 객체.
 * @param {Object} newProps - 새로운 속성 객체.
 */

export const handleUpdateAttr = (target, originNewProps, originOldProps) => {
  if (!originOldProps && !originNewProps) return;

  const newProps = originNewProps ?? {};
  const oldProps = originOldProps ?? {};

  // 속성 제거 처리
  Object.entries(oldProps).forEach(([attr, value]) => {
    if (!newProps[attr]) {
      if (attr.startsWith("on")) {
        const eventType = attr.slice(2).toLowerCase();
        removeEvent(target, eventType, value);
      } else {
        target?.removeAttribute(attr);
      }
    }
  });

  // 속성 추가/갱신 처리
  Object.entries(newProps).forEach(([attr, value]) => {
    if (oldProps[attr] !== value) {
      if (attr.startsWith("on") && typeof value === "function") {
        const eventType = attr.slice(2).toLowerCase();

        if (typeof oldProps[attr] === "function") {
          removeEvent(target, eventType, oldProps[attr]);
        }

        addEvent(target, eventType, value);
      } else {
        target.setAttribute(attr === "className" ? "class" : attr, value);
      }
    }
  });
};
