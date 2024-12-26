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
  const handleLike = () => {
    const { posts, loggedIn, currentUser } = globalStore.getState();

    // 로그인되어있지 않은경우 alert
    if (!loggedIn) return alert("로그인 후 이용해주세요");

    // 좋아요 누른 게시물 업데이트
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        // 좋아요 누른 게시물 업데이트 (얕은 복사)
        const newLikeUsers = post.likeUsers.includes(currentUser.username)
          ? post.likeUsers.filter((user) => user !== currentUser.username)
          : [...post.likeUsers, currentUser.username];

        // 좋아요 누른 게시물 업데이트
        return {
          ...post,
          likeUsers: newLikeUsers,
        };
      }
      return post;
    });

    // 좋아요 누른 게시물 업데이트
    // 어쨋든 여기서 notify가 호출되므로 좋아요 누른 게시물 업데이트
    globalStore.setState({ posts: updatedPosts });
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
          onClick={handleLike}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
