import userEvent from "@testing-library/user-event";
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

describe("기본과제 테스트", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe("1. 라우팅 구현", () => {
    it('"/" 경로로 접근하면 홈 페이지가 렌더링된다', () => {
      goTo("/");
      const headers = [...document.querySelectorAll("header")];
      expect(headers.length).toBe(1);
      expect(headers[0].innerHTML.includes("항해플러스")).toBe(true);
    });

    it('"/login" 경로로 접근하면 로그인 페이지가 렌더링된다', () => {
      goTo("/login");
      const submitButtons = [
        ...document.querySelectorAll("form button[type='submit']"),
      ];
      expect([...document.querySelectorAll("header")].length).toBe(0);
      expect(submitButtons.length).toBe(1);
      expect(submitButtons[0].innerHTML.includes("로그인")).toBe(true);
    });

    it('로그인이 되지 않은 상태에서 "/profile" 경로로 접근하면, 로그인 페이지로 리다이렉션 된다.', () => {
      // 로그인 상태 시뮬레이션
      goTo("/profile");

      const submitButtons = [
        ...document.querySelectorAll("form button[type='submit']"),
      ];
      expect([...document.querySelectorAll("header")].length).toBe(0);
      expect(submitButtons.length).toBe(1);
      expect(submitButtons[0].innerHTML.includes("로그인")).toBe(true);
    });

    it("존재하지 않는 경로로 접근하면 404 페이지가 렌더링된다", () => {
      goTo("/nonexistent");
      expect(document.body.innerHTML).toContain("404");
    });
  });

  describe("2. 사용자 관리 기능", () => {
    it("로그인 폼에서 사용자 이름을 입력하고 제출하면 로그인 되고, 로그아웃 버튼 클릭시 로그아웃 된다.", async () => {
      goTo("/login");

      const loginForm = document.getElementById("login-form");

      await user.type(document.getElementById("username"), "testuser");

      loginForm.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      );

      expect(localStorage.getItem("user")).toEqual(
        `{"username":"testuser","email":"","bio":""}`,
      );

      const logoutButton = document.getElementById("logout");
      logoutButton.click();

      expect(localStorage.getItem("user")).toEqual(null);
    });
  });

  describe("3. 프로필 페이지 구현", () => {
    beforeEach(async () => {
      goTo("/login");

      const loginForm = document.getElementById("login-form");

      await user.type(document.getElementById("username"), "testuser");

      loginForm.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      );

      goTo("/profile");
    });

    afterEach(() => {
      document.querySelector("#logout").click();
    });

    it("로그인한 사용자의 이름과 소개가 표시된다", () => {
      expect(document.getElementById("username").value).toBe("testuser");
      expect(document.getElementById("email").value).toContain("");
      expect(document.getElementById("bio").value).toContain("");
    });

    it("프로필 수정 기능이 동작한다", () => {
      const profileForm = document.getElementById("profile-form");
      const bioInput = document.getElementById("bio");

      bioInput.value = "Updated bio";
      profileForm.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      );

      expect(localStorage.getItem("user")).toEqual(
        `{"username":"testuser","email":"","bio":"Updated bio"}`,
      );
    });
  });

  describe("4. 컴포넌트 기반 구조 설계", () => {
    beforeEach(async () => {
      goTo("/login");

      const loginForm = document.getElementById("login-form");

      await user.type(document.getElementById("username"), "testuser");

      loginForm.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      );

      window.history.pushState({}, "", "/profile");
      window.dispatchEvent(new Event("popstate"));
    });

    it("Header, Footer 컴포넌트가 메인 페이지와 프로필 페이지에 존재하고, 로그인페이지와 에러페이지에는 존재하지 않는다.", async () => {
      goTo("/");
      expect(document.querySelector("header")).not.toBeFalsy();
      expect(document.querySelector("footer")).not.toBeFalsy();
      expect(document.querySelector("nav")).not.toBeFalsy();

      goTo("/profile");
      expect(document.querySelector("header")).not.toBeFalsy();
      expect(document.querySelector("footer")).not.toBeFalsy();
      expect(document.querySelector("nav")).not.toBeFalsy();

      goTo("/404");
      expect(document.querySelector("header")).toBeFalsy();
      expect(document.querySelector("footer")).toBeFalsy();
      expect(document.querySelector("nav")).toBeFalsy();

      goTo("/");
      await user.click(document.querySelector("#logout"));

      goTo("/login");
      expect(document.querySelector("header")).toBeFalsy();
      expect(document.querySelector("footer")).toBeFalsy();
      expect(document.querySelector("nav")).toBeFalsy();
    });
  });

  describe("5. 상태 관리 구현", () => {
    it("로그인 상태에 따라 UI가 변경된다", async () => {
      // 로그아웃 상태
      expect(document.body.innerHTML).toContain("로그인");

      // 로그인
      goTo("/login");

      const loginForm = document.getElementById("login-form");

      await user.type(document.getElementById("username"), "testuser");

      loginForm.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      );

      // 로그인 상태
      expect(document.body.innerHTML).toContain("로그아웃");
    });
  });

  describe("6. 기본적인 에러 처리", () => {
    it("잘못된 라우트 접근 시 404 페이지로 리다이렉션된다", () => {
      window.history.pushState({}, "", "/nonexistent");
      window.dispatchEvent(new Event("popstate"));
      expect(document.body.innerHTML).toContain("404");
      expect(document.body.innerHTML).toContain("페이지를 찾을 수 없습니다");
    });
  });
});
