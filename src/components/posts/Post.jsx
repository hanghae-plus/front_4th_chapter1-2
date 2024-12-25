/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores/globalStore.js";

export const Post = ({ author, time, content, likeUsers, id }) => {
  const { loggedIn, currentUser, posts } = globalStore.getState();

  const handleLikeClick = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
    } else {
      const postIndex = posts.findIndex((post) => post.id === id);
      if (postIndex !== -1) {
        const post = posts[postIndex];
        const likeUserIndex = post.likeUsers.indexOf(currentUser.username);

        if (likeUserIndex === -1) {
          post.likeUsers.push(currentUser.username);
        } else {
          post.likeUsers.splice(likeUserIndex, 1);
        }
        globalStore.setState({ posts });
      }
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
          className={`like-button cursor-pointer${
            likeUsers.includes(currentUser?.username) ? " text-blue-500" : ""
          }`}
          onClick={handleLikeClick}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
