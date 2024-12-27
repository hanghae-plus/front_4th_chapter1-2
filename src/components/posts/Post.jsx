/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

import { toTimeFormat } from "../../utils/index.js";

export const Post = ({ author, time, content, likeUsers, id }) => {
  const { loggedIn, posts, currentUser } = globalStore.getState();
  const activationLike =
    currentUser && likeUsers.includes(currentUser.username);

  const handleLike = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
    } else {
      const post = posts.find((post) => post.id === id);
      const currentUsername = currentUser.username;
      const likeUserIndex = post.likeUsers.indexOf(currentUsername);

      if (likeUserIndex === -1) {
        post.likeUsers.push(currentUsername);
      } else {
        post.likeUsers.splice(likeUserIndex, 1);
      }

      globalStore.setState({ posts });
    }
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
          onClick={handleLike}
          className={`like-button cursor-pointer${activationLike ? " text-blue-500" : ""}`}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
