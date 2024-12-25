import { HTMLEventName } from "@/types/event";
import { htmlEventNames } from "@/constants/htmlEventsName";

// 이벤트 핸들러와 관련 설정을 저장할 타입 정의
interface EventHandlerConfig {
  capture: boolean; // 캡처링 단계에서 처리할지 여부
  handler: (e: SyntheticEvent) => void; // 실제 이벤트 핸들러
}

// React 처럼 브라우저간 일관된 이벤트 객체를 제공하기 위한 인터페이스
interface SyntheticEvent extends Event {
  nativeEvent: Event; // 원본 DOM 이벤트 참조 보관
  isPropagationStopped(): boolean; // 이벤트 전파 중단 여부 확인
  stopPropagation(): void; // 이벤트 전파 중단 메서드
  preventDefault(): void; // 기본 동작 방지 메서드 추가
}

// WeakMap 을 사용해 메모리 누수를 방지하며 이벤트 리스너 저장
let listeners: Partial<
  Record<HTMLEventName, WeakMap<HTMLElement, EventHandlerConfig>>
> = {};

// 이벤트 시스템 초기 설정
export function setupEventListeners($root: HTMLElement) {
  // 기존에 등록된 리스너들을 모두 제거 (메모리 누수 방지)
  // 동일한 핸들러 참조를 사용해 제거
  htmlEventNames.forEach((eventType) => {
    $root.removeEventListener(eventType, bubblePhaseHandler, false);
    $root.removeEventListener(eventType, capturePhaseHandler, true);
  });

  // 새로운 리스너 등록
  registerGlobalEvent($root);
}

// 이벤트 리스너 등록 함수
export function addEvent(
  element: HTMLElement,
  eventType: HTMLEventName,
  handler: (e: SyntheticEvent) => void,
  capture: boolean = false, // 기본값은 버블링 단계
) {
  // 해당 이벤트 타입의 WeakMap 이 없다면 생성
  if (!listeners[eventType]) {
    listeners[eventType] = new WeakMap();
  }
  // 요소와 핸들러 정보를 WeakMap 에 저장
  listeners[eventType].set(element, { capture, handler });
}

// 이벤트 리스너 제거 함수
export function removeEvent(element: HTMLElement, eventType: HTMLEventName) {
  listeners[eventType]?.delete(element);
}

// 전역 이벤트 리스너 등록
// createPhaseHandler 함수 제거하고 미리 생성한 핸들러 사용
function registerGlobalEvent($root: HTMLElement) {
  htmlEventNames.forEach((eventType) => {
    $root.addEventListener(eventType, bubblePhaseHandler, false);
    $root.addEventListener(eventType, capturePhaseHandler, true);
  });
}

// 실제 이벤트를 처리하는 핸들러
function handleGlobalEvent(e: Event, isCapturing: boolean) {
  // 이벤트가 발생한 요소부터 시작해서 부모로 올라가며 처리
  let currentTarget: HTMLElement | null = e.target as HTMLElement;
  const eventType = e.type as HTMLEventName;

  // DOM 트리를 따라 올라가며 각 요소의 이벤트 핸들러 실행
  while (currentTarget) {
    const listener = listeners[eventType]?.get(currentTarget);
    if (listener && listener.capture === isCapturing) {
      // 합성 이벤트 생성 및 핸들러 호출
      const syntheticEvent = createSyntheticEvent(e);
      listener.handler(syntheticEvent);

      // stopPropagation 이 호출됐다면 이벤트 전파 중단
      if (syntheticEvent.isPropagationStopped()) {
        break;
      }
    }
    currentTarget = currentTarget.parentElement;
  }
}

// 합성 이벤트 객체를 생성하는 함수
function createSyntheticEvent(nativeEvent: Event): SyntheticEvent {
  let isPropagationStopped = false;

  // 원본 이벤트를 감싸서 합성 이벤트 생성
  return {
    ...nativeEvent,
    nativeEvent, // 원본 이벤트 참조 보관
    target: nativeEvent.target as HTMLElement,
    // 이벤트 전파 중단 여부 확인
    isPropagationStopped: () => isPropagationStopped,
    // 이벤트 전파를 중단시키는 메서드
    stopPropagation: () => {
      isPropagationStopped = true;
      nativeEvent.stopPropagation();
    },
    // 기본 동작 방지 메서드 추가
    preventDefault: () => {
      nativeEvent.preventDefault();
    },
  } as SyntheticEvent;
}

// 각 단계별 핸들러를 한 번만 생성하도록 수정
const capturePhaseHandler = (e: Event) => handleGlobalEvent(e, true);
const bubblePhaseHandler = (e: Event) => handleGlobalEvent(e, false);
