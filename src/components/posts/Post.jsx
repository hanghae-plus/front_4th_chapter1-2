/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores/globalStore.js";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  const { loggedIn, currentUser } = globalStore.getState();
  const { setState } = globalStore;

  // 현재 사용자가 좋아요를 눌렀는지 확인
  const isLikedByCurrentUser = likeUsers.includes(currentUser?.username);

  const handleLikeToggle = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const updatedPosts = globalStore.getState().posts.map((post) => {
      if (post.id === id) {
        const updatedLikeUsers = isLikedByCurrentUser
          ? post.likeUsers.filter((user) => user !== currentUser.username) // 좋아요 취소
          : [...post.likeUsers, currentUser.username]; // 좋아요 추가

        return { ...post, likeUsers: updatedLikeUsers };
      }
      return post;
    });

    // 상태 업데이트
    setState({ posts: updatedPosts });
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
