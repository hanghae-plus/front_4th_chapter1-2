/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/index.js";

export const PostForm = () => {
  const { addPost } = globalStore.actions;

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const contentInput = document.getElementById("post-content");
    const content = contentInput.value.trim();
    if (!content) return;

    addPost(content);
    contentInput.value = "";
  };
  return (
    <form
      onSubmit={handlePostSubmit}
      className="mb-4 bg-white rounded-lg shadow p-4"
    >
      <textarea
        id="post-content"
        name="content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        type="submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </form>
  );
};
