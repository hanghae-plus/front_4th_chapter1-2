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
import { globalStore } from "../../stores/globalStore.js";

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

    it("포스트가 하나도 없을 때도,포스트를 추가할 수 있다.", async () => {
      globalStore.setState({
        posts: [],
      });

      await user.type(
        document.getElementById("post-content"),
        "새로운 포스트입니다.",
      );
      await user.click(document.getElementById("post-submit"));

      expect(globalStore.getState().posts.length).toBe(1);
      expect(globalStore.getState().posts[0].id).toBe(1);
      expect(globalStore.getState().posts[0].content).toBe(
        "새로운 포스트입니다.",
      );
    });
  });
});
