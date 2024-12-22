import { day, hour, minute } from "../libs";

export const toTimeFormat = (time: number) => {
  const diff = Date.now() - time;
  if (diff < minute) {
    return "방금 전";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}분 전`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`;
  }

  return new Date(time).toLocaleString();
};
