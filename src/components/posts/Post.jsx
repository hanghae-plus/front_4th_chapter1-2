/** @jsx createVNode */
import { createVNode } from "../../lib";
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
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const onClick = () => {
    if (!user) {
      alert("로그인 후 이용해주세요");
    } else {
      const { posts } = globalStore.getState();
      const updatedPost = posts.map((post) => {
        if (post.id === id) {
          const hasLiked = post.likeUsers.includes(user.username);
          return {
            ...post,
            likeUsers: hasLiked
              ? post.likeUsers.filter((username) => username !== user.username)
              : [...post.likeUsers, user.username],
          };
        }
        return post;
      });
      globalStore.setState({ posts: updatedPost });
    }
  };

  const hasLiked = user && likeUsers.includes(user.username);

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
          className={`like-button cursor-pointer${hasLiked ? " text-blue-500" : ""}`}
          onClick={onClick}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
