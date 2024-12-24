/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/index.js";

export const PostForm = () => {
  const postPost = () => {
    const content = document.querySelector("#post-content").value;
    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }

    globalStore.setState({
      posts: [
        ...globalStore.getState().posts,
        {
          id: globalStore.getState().posts.length + 1,
          author: globalStore.getState().currentUser.username,
          content,
          time: Date.now(),
          likeUsers: [],
        },
      ],
    });
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => postPost()}
      >
        게시
      </button>
    </div>
  );
};
