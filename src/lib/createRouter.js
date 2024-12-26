import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  // Observer 패턴으로 구독 관리 설정
  const { subscribe, notify } = createObserver();

  // 현재 경로 가져오기
  const getPath = () => window.location.pathname;

  // 현재 경로에 매칭되는 컴포넌트 가져오기
  const getTarget = () => routes[getPath()];

  // 경로 이동
  const push = (path) => {
    // 새로고침 하지 않고 URL 변경
    window.history.pushState(null, null, path);

    // 구독자에게 상태 변경 알림
    notify();
  };

  // 브라우저 히스토리 변경 시 구독자에게 상태 변경 알림
  window.addEventListener("popstate", () => notify());

  return {
    get path() {
      return getPath();
    },
    push,
    subscribe,
    getTarget,
  };
};
