/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore.js";
import { toTimeFormat } from "../../utils/index.js";

export const Post = ({ author, time, content, likeUsers }) => {
  const { currentUser } = globalStore.getState();
  const activationLike = likeUsers.includes(currentUser?.username);

  const toggleLike = () => {
    if (!currentUser) {
      alert("로그인 후 이용해주세요");
      return;
    }

    globalStore.setState(({ posts, ...rest }) => {
      const foundIndex = posts.findIndex((post) => post.author === author);

      const updatedPost = {
        ...posts[foundIndex],
        likeUsers: activationLike
          ? likeUsers.filter((likeUser) => likeUser !== currentUser.username)
          : [...likeUsers, currentUser.username],
      };

      const clonedPosts = [...posts];
      clonedPosts[foundIndex] = updatedPost;

      return { ...rest, posts: clonedPosts };
    });
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
          onClick={toggleLike}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
