import { VNodeProps, DOMEventType } from "../types";
import { removeEvent, addEvent } from "./eventManager";

/**
 * DOM Element의 속성을 비교하여 업데이트하는 함수
 * @param target - 업데이트할 DOM Element
 * @param newProps - 새로운 속성들
 * @param oldProps - 이전 속성들
 */
export function updateAttributes(
  element: HTMLElement,
  newProps: VNodeProps | null,
  oldProps: VNodeProps | null = null,
) {
  if (!newProps && !oldProps) return;

  // 이전 속성 제거
  if (oldProps) {
    Object.keys(oldProps).forEach((key) => {
      if (key === "children") return;

      if (key.startsWith("on")) {
        const eventType = key.substring(2).toLowerCase() as DOMEventType;
        removeEvent(element, eventType, oldProps[key]);
      } else if (!newProps || !(key in newProps)) {
        element.removeAttribute(key);
      }
    });
  }

  // 새 속성 설정
  if (newProps) {
    Object.entries(newProps).forEach(([key, value]) => {
      if (key === "children") return;

      if (key === "className") {
        if (value) element.setAttribute("class", value);
        return;
      }

      if (key.startsWith("on")) {
        const eventType = key.substring(2).toLowerCase() as DOMEventType;
        addEvent(element, eventType, value);
        return;
      }

      if (value != null && (!oldProps || oldProps[key] !== value)) {
        element.setAttribute(key, String(value));
      }
    });
  }
}
