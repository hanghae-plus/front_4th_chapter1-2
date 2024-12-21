import { createObserver } from "./createObserver";

export const createHashRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  // 현재 해시 경로를 가져오는 함수
  const getPath = () => {
    // 해시가 없으면 '/'를, 있으면 '#' 이후의 경로를 반환
    return window.location.hash ? window.location.hash.slice(1) : "/";
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.location.hash = path;
  };

  // 해시 변경 이벤트 리스너
  window.addEventListener("hashchange", notify);

  // 초기 로드 시 해시가 없는 경우를 처리
  window.addEventListener("load", () => {
    if (!window.location.hash) {
      push("/");
    }
  });

  return {
    get path() {
      return getPath();
    },
    push,
    subscribe,
    getTarget,
  };
};
