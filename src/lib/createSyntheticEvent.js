export const SUPPORTED_EVENTS = new Set([
  "click",
  "change",
  "input",
  "submit",
  "keydown",
  "keyup",
  "keypress",
  "mousedown",
  "mouseup",
  "mouseover",
  "mouseout",
  "mousemove",
  "focus",
  "blur",
]);

/*
 * 합성 이벤트를 생성한다.
 *
 */
export function createSyntheticEvent(navigateEvent) {
  const syntheticEvent = {
    navigateEvent, // 원본 브라우저 이벤트 객체
    target: navigateEvent.target, // 이벤트가 발생한 실제 DOM 요소
    currentTarget: navigateEvent.currentTarget, // 현재 이벤트가 처리되고 있는 DOM 요소
    type: navigateEvent.type, // 이벤트 타입
    bubbles: navigateEvent.bubbles, // 이벤트 버블링 여부
    preventDefault() {
      // 기본 동작 방지
      this.defaultPrevented = true;
      navigateEvent.preventDefault();
    },
    stopPropagation() {
      // 이벤트 전파 중단
      this.propagationStopped = true;
      navigateEvent.stopPropagation();
    },
    defaultPrevented: false,
    propagationStopped: false,
    persist() {
      // 이벤트 객체 유지
      Object.freeze(this);
    },
  };
  return syntheticEvent;
}
