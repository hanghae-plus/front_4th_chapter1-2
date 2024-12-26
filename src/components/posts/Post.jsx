/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/index.js";
import { toTimeFormat } from "../../utils/index.js";

function isLoggedIn() {
  const { currentUser } = globalStore.getState();
  return !!currentUser;
}

/**
 * 게시물 좋아요 토글 함수
 * @description 로그인 여부에 따라 좋아요 버튼을 클릭할 수 있는지 확인하고, 좋아요 상태를 변경
 * 1) 현재 사용자가 로그인 되어있지 않다면 alert를 띄운다
 * 2) 현재 사용자가 로그인 되어있다면, 해당 게시글의 좋아요 상태를 변경한다
 * 2-1) 이미 좋아요를 누른 상태라면 좋아요를 취소한다
 * 2-2) 아직 좋아요를 누르지 않은 상태라면 좋아요를 누른다
 * 3) 변경된 게시글 목록을 globalStore에 저장한다
 * @param {number} id 게시글 id
 */
function handleLike(id) {
  const { posts, currentUser } = globalStore.getState();

  const updatedPosts = posts.map((post) => {
    if (post.id !== id) {
      return post;
    }
    const username = currentUser?.username;
    const alreadyLiked = post.likeUsers.find((name) => name === username);
    const newPost = {
      ...post,
      likeUsers: alreadyLiked
        ? post.likeUsers.filter((user) => user !== username)
        : [...post.likeUsers, username],
    };
    return { ...newPost };
  });

  globalStore.setState({ posts: updatedPosts });
}

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
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
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn()) {
              alert("로그인 후 이용해주세요");
              return;
            }
            handleLike(id);
          }}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
