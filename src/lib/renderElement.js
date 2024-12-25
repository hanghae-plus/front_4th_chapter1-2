import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

import { addEvent } from "./eventManager";
import { Post } from "../components";
import { globalStore } from "../stores";

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  vNode = normalizeVNode(vNode);
  let element = createElement(vNode);

  container.innerHTML = "";
  container.appendChild(element);
  setupEventListeners(container);

  const postContentElement = document.getElementById("post-content");
  const postContentButtonElement = document.getElementById("post-submit");
  const { loggedIn } = globalStore.getState();

  if (!loggedIn) {
    updateElement(container, null, postContentElement);

    const lineButtonList = document.querySelectorAll(
      "#posts-container .like-button",
    );

    const handleLikeButtonClick = () => {
      alert("로그인 후 이용해주세요");
    };

    lineButtonList.forEach((element) => {
      addEvent(element, "click", handleLikeButtonClick);
    });

    setupEventListeners(container);
  } else {
    const { username } = globalStore.getState().currentUser;

    const handleSubmit = () => {
      const newPost = Post({
        author: username,
        time: Date.now(),
        content: document.getElementById("post-content").value,
        likeUsers: [],
      });

      const newPostElement = createElement(normalizeVNode(newPost));
      const postContainer = document.getElementById("posts-container");

      updateElement(postContainer, newPostElement);
    };

    const handleLickButtonClick = (e) => {
      const currentButtonElement = e.target;

      const [text, count] = currentButtonElement.innerHTML.split(" ");

      let refinedCount = Number(count);
      const likedButtonClassName = "text-blue-500";

      if (refinedCount === 0) {
        refinedCount++;
      } else {
        refinedCount--;
      }

      currentButtonElement.innerHTML = `${text} ${refinedCount}`;
      currentButtonElement.classList.toggle(likedButtonClassName);
    };

    addEvent(postContentButtonElement, "click", handleSubmit);

    const likeButtonList = document.querySelectorAll(
      "#posts-container .like-button",
    );

    likeButtonList.forEach((element) => {
      addEvent(element, "click", handleLickButtonClick);
    });

    setupEventListeners(container);
  }
}
