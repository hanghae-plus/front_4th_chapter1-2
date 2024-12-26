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
  activationLike,
}) => {
  const handleLikeToggle = () => {
    const state = globalStore.getState(); // 상태 객체 전체를 복사. (최신 상태 유지 위해)
    const { posts, loggedIn, currentUser } = state;

    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const username = currentUser?.username;

    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        const isActiveLike = post.likeUsers.includes(username);
        return {
          ...post,
          likeUsers: isActiveLike
            ? post.likeUsers.filter((user) => user !== username) // 좋아요 취소.
            : [...post.likeUsers, username], // 좋아요 추가.
        };
      }
      return post;
    });

    // posts만 설정할 경우 다른 상태(currentUser 등)가 손실 될(undefined 등) 위험 있으므로 다른 state와 함께 설정.
    globalStore.setState({ ...state, posts: updatedPosts });
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
          onClick={handleLikeToggle}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
