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
  const { getState, setState } = globalStore;
  const { currentUser, loggedIn, posts } = getState();

  const handleLike = () => {
    if (!loggedIn) {
      window.alert("로그인 후 이용해주세요.");
      return;
    }

    const targetPost = posts.find((post) => post.id === id);
    const username = currentUser.username;

    // 좋아요 상태 업데이트
    const updatedLikeUsers = targetPost.likeUsers.includes(username)
      ? targetPost.likeUsers.filter((user) => user !== username)
      : [...targetPost.likeUsers, username];

    // 새 포스트 업데이트
    const updatedPost = { ...targetPost, likeUsers: updatedLikeUsers };
    const updatedPosts = posts.map((post) =>
      post.id === id ? updatedPost : post,
    );

    setState({ posts: updatedPosts });

    // const targetPost = posts.find((post) => post.id === id);
    // const prevLikeUsers = targetPost.likeUsers;
    // const username = currentUser.username;
    // const likeUsers = prevLikeUsers.includes(username)
    //   ? prevLikeUsers.filter((user) => user !== username)
    //   : [...prevLikeUsers, username];
    // const newPost = { ...targetPost, likeUsers };

    // updatePost(newPost);
  };

  // const updatePost = (newPost) => {
  //   const { id } = newPost;
  //   const newPosts = posts.map((post) => (post.id === id ? newPost : post));
  //   setState({ posts: newPosts });
  // };

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
