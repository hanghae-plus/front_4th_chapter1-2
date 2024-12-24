/** @jsx createVNode */
import { createVNode } from "../../lib";
import { userStorage } from "../../storages/userStorage.js";
import { globalStore } from "../../stores/globalStore.js";
import { toTimeFormat } from "../../utils/index.js";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  const state = globalStore.getState();

  const clickLikeHandler = () => {
    if (!state.loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const username = state.currentUser?.username;
    if (likeUsers.includes(username)) {
      likeUsers = likeUsers.filter((user) => user !== username);
    } else {
      likeUsers.push(username);
    }

    state.posts.map((post) => {
      if (post.id === id) {
        post.likeUsers = likeUsers;
      }
    });
    globalStore.setState(state);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center mb-2">
        <div>
          <div className="font-bold">{author}</div>
          <div className="text-gray-500 text-sm">{toTimeFormat(time)}</div>
        </div>
      </div>
      <p>{content}</p>
      <div className="mt-2 flex justify-between text-gray-500">
        <span
          className={`like-button cursor-pointer${activationLike ? " text-blue-500" : ""}`}
          onClick={clickLikeHandler}
        >
          좋아요 {likeUsers?.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
