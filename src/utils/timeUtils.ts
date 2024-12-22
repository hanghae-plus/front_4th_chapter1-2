const 초 = 1000;
const 분 = 초 * 60;
const 시간 = 분 * 60;
const 일 = 시간 * 24;

export const toTimeFormat = (time) => {
  const diff = Date.now() - time;
  if (diff < 분) {
    return "방금 전";
  }

  if (diff < 시간) {
    return `${Math.floor(diff / 분)}분 전`;
  }

  if (diff < 일) {
    return `${Math.floor(diff / 시간)}시간 전`;
  }

  return new Date(time).toLocaleString();
};
