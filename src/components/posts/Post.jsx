/** @jsx createVNode */
import { addEvent, createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore.js";
import { toTimeFormat } from "../../utils/index.js";

export const Post = ({ id, author, time, content, likeUsers }) => {
  const { currentUser } = globalStore.getState();
  const { like } = globalStore.actions;

  const onClickLike = () => {
    like(id);
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
          className={`like-button cursor-pointer${likeUsers.includes(currentUser?.username) ? " text-blue-500" : ""}`}
          onClick={onClickLike}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
