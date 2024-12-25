/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores/index.js";

export const Post = ({ author, time, content, likeUsers }) => {
  const { loggedIn, currentUser, posts } = globalStore.getState();
  const activationLike = likeUsers.includes(currentUser?.username);
  const handleLike = () => {
    if (!currentUser) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const newPosts = posts.map((post) => {
      if (post.author === author && post.time === time) {
        return {
          ...post,
          likeUsers: activationLike
            ? post.likeUsers.filter((user) => user !== currentUser.username)
            : [...post.likeUsers, currentUser?.username],
        };
      }
      return post;
    });
    globalStore.setState({ posts: newPosts });
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
