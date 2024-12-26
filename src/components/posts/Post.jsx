/** @jsx createVNode */
import { createVNode } from "../../lib";
import { userStorage } from "../../storages/userStorage.js";
import { globalStore } from "../../stores/globalStore.js";
import { toTimeFormat } from "../../utils/index.js";

export const Post = ({
  author,
  time,
  content,
  id,
  likeUsers,
  activationLike = false,
}) => {
  const addLike = () => {
    const { posts } = globalStore.getState();
    const username = userStorage.get("user")?.username;

    if (!username) return;

    globalStore.setState({
      posts: posts.map((post) => {
        if (post.id !== id) return post;

        if (post.likeUsers.includes(username)) {
          return {
            ...post,
            likeUsers: post.likeUsers.filter(
              (likeUser) => likeUser !== username,
            ),
          };
        }

        return {
          ...post,
          likeUsers: [username, ...post.likeUsers],
        };
      }),
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
          onClick={() => {
            if (!userStorage.get("user")) {
              alert("로그인 후 이용해주세요");
            } else {
              addLike();
            }
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
