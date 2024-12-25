/** @jsx createVNode */
/** @jsxFrag Fragment */
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import userEvent from "@testing-library/user-event";

let user;

beforeAll(async () => {
  // DOM 초기화
  window.alert = vi.fn();
  document.body.innerHTML = '<div id="root"></div>';
  await import("../../main.jsx");
});

afterAll(() => {
  // 각 테스트 전에 root 엘리먼트 초기화
  document.getElementById("root").innerHTML = "";
  localStorage.removeItem("user");
});

beforeEach(() => {
  user = userEvent.setup();
});

const goTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
};

describe("Chapter1-2 > 심화과제 > 포스트 관리", () => {
  describe("비사용자 > ", () => {
    it("포스트 작성 폼이 보이지 않는다", () => {
      expect(document.getElementById("post-content")).toBeNull();
    });

    it("포스트에 좋아요를 클릭할 경우, 경고 메세지가 발생한다.", () => {
      const [$likeButton] = [
        ...document.querySelectorAll("#posts-container .like-button"),
      ];

      $likeButton.click();
      expect(window.alert).toHaveBeenCalledWith("로그인 후 이용해주세요");
    });
  });

  describe("사용자 > ", () => {
    beforeEach(async () => {
      goTo("/login");
      const loginForm = document.getElementById("login-form");

      await user.type(document.getElementById("username"), "testuser");

      loginForm.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      );

      goTo("/");
    });

    afterEach(async () => {
      await user.click(document.getElementById("logout"));
    });

    it("포스트 작성 폼이 보인다.", () => {
      expect(document.getElementById("post-content")).not.toBeNull();
    });

    it("포스트를 추가할 수 있다.", async () => {
      await user.type(
        document.getElementById("post-content"),
        "새로운 포스트입니다.",
      );
      await user.click(document.getElementById("post-submit"));

      expect(document.querySelector("#posts-container > div").innerHTML).toBe(
        `<div class="flex items-center mb-2"><div><div class="font-bold">testuser</div><div class="text-gray-500 text-sm">방금 전</div></div></div><p>새로운 포스트입니다.</p><div class="mt-2 flex justify-between text-gray-500"><span class="like-button cursor-pointer">좋아요 0</span><span>댓글</span><span>공유</span></div>`,
      );
    });

    it("포스트에 좋아요를 클릭할 경우, 좋아요가 토글된다.", () => {
      const [$likeButton] = [
        ...document.querySelectorAll("#posts-container .like-button"),
      ];

      expect($likeButton.outerHTML).toBe(
        '<span class="like-button cursor-pointer">좋아요 0</span>',
      );
      $likeButton.click();
      expect($likeButton.outerHTML).toBe(
        '<span class="like-button cursor-pointer text-blue-500">좋아요 1</span>',
      );
      $likeButton.click();
      expect($likeButton.outerHTML).toBe(
        '<span class="like-button cursor-pointer">좋아요 0</span>',
      );
    });
  });
});
