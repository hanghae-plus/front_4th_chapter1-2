/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores/index.js";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  const { loggedIn, currentUser } = globalStore.getState();

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
          onClick={() => {
            if (!loggedIn) return window.alert("로그인 후 이용해주세요");

            const prev = [...globalStore.getState().posts];

            const targetPostIndex = prev.findIndex((post) => post.id === id);

            const targetPost = prev[targetPostIndex];
            const likeUsers = targetPost.likeUsers;

            const likeUser = currentUser.username;

            const newLikeUsers = activationLike
              ? likeUsers.filter((user) => user !== likeUser)
              : [...likeUsers, likeUser];

            const newPost = {
              ...targetPost,
              likeUsers: newLikeUsers,
            };
            prev[targetPostIndex] = newPost;
            globalStore.setState({
              posts: prev,
            });
          }}
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
