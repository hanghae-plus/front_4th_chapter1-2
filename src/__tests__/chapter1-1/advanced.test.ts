import userEvent from "@testing-library/user-event";
import {
  afterAll,
  beforeAll,
  beforeEach,
  expect,
  describe,
  it,
  vi,
} from "vitest";

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

const goTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
};

beforeEach(() => {
  goTo("/");
  document.querySelector("#logout")?.click();
});

describe("심화과제 테스트", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe("2. 라우트 가드 구현", () => {
    it("비로그인 사용자가 프로필 페이지에 접근시 로그인 페이지로 리다이렉트 한다.", async () => {
      goTo("/profile");

      expect(document.body.innerHTML).toContain("로그인");
    });

    it("로그인된 사용자가 로그인 페이지에 접근시 메인 페이지로 리다이렉트 한다.", async () => {
      goTo("/login");

      const loginForm = document.getElementById("login-form");

      await user.type(document.getElementById("username"), "testuser");

      loginForm.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      );

      goTo("/login");
      expect(
        document.querySelector("nav .text-blue-600.font-bold").innerHTML,
      ).toContain("홈");
    });
  });

  describe("3. 이벤트 위임 활용", () => {
    it("네비게이션의 링크 클릭에서 이벤트 전파를 막았을 때, 아무일도 일어나지 않는다.", async () => {
      goTo("/");

      const firstTarget = document.querySelector('nav a[href="/login"]');

      firstTarget.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
      });

      await user.click(firstTarget);

      // 클릭 이벤트 생성 및 트리거
      expect(document.body.querySelector("header")).not.toBeFalsy();
    });
  });
});
