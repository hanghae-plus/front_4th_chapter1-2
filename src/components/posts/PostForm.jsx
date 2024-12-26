/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";
import { getTime } from "../../utils";

export const PostForm = () => {
  const { currentUser } = globalStore.getState();
  const { addPost } = globalStore.actions;

  const onSumbit = (event) => {
    event.preventDefault();

    const contentElement = document.getElementById("post-content");
    const content = contentElement.value || "";

    if (!contentElement.value.trim()) {
      alert("게시글 내용을 입력해주세요.");

      return;
    }

    addPost({
      author: currentUser.username,
      content,
      time: getTime(),
    });

    contentElement.value = "";
  };

  return (
    <form className="mb-4 bg-white rounded-lg shadow p-4" onSubmit={onSumbit}>
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </form>
  );
};
