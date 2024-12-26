/**
 * 구독자 관리 함수
 * @returns { subscribe: (fn: () => void) => void, notify: () => void }
 */
export const createObserver = () => {
  // 구독자 목록
  const listeners = new Set();

  // 구독자 추가
  const subscribe = (fn) => listeners.add(fn);

  // 구독자에게 알림
  const notify = () => listeners.forEach((listener) => listener());

  return { subscribe, notify };
};
