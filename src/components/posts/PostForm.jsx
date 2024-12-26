/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

const addPost = (e) => {
  e.preventDefault();
  const contentInput = document.getElementById("post-content");
  const content = contentInput.value.trim(); // const 선언 유지
  if (!content) {
    return;
  }

  const { addPost } = globalStore.actions;
  addPost(content);

  contentInput.value = ""; //초기화
};

export const PostForm = () => {
  return (
    <form className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={addPost}
      >
        게시
      </button>
    </form>
  );
};
