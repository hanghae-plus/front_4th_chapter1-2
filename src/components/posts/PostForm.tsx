/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";
import { getCurrentTime } from "../../utils";

export const PostForm = () => {
  const { addPost } = globalStore.actions;
  const { currentUser } = globalStore.getState();

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    if (!currentUser) return;

    const content = document.getElementById("post-content").value as string;
    addPost({
      author: currentUser.username,
      content,
      time: getCurrentTime(),
    });
  };

  return (
    <form
      className="mb-4 bg-white rounded-lg shadow p-4"
      onSubmit={handleSubmit}
    >
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
