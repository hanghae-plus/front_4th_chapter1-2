/** @jsx createVNode */
import { createVNode } from "@/lib";
import { toTimeFormat } from "@/utils";
import { globalStore } from "@/stores";

export const Post = ({ id, author, time, content, likeUsers }) => {
  const { loggedIn, posts, currentUser } = globalStore.getState();
  const activationLike = likeUsers.includes(currentUser?.username);

  const handleClickLike = (e) => {
    e.stopPropagation();
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const username = currentUser?.username;
    const newLikeUsers = likeUsers.includes(username)
      ? likeUsers.filter((user) => user !== username)
      : [...likeUsers, username];
    const newPosts = posts.map((post) =>
      post.id === id ? { ...post, likeUsers: newLikeUsers } : post,
    );

    globalStore.setState({
      posts: newPosts,
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
          onClick={handleClickLike}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
