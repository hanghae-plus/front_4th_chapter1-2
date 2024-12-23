/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore";

export const PostForm = () => {
  const { addPost } = globalStore.actions;
  const { currentUser } = globalStore.getState();

  const handleAddPost = (event) => {
    event.preventDefault();
    const content = new FormData(event.target).get("postContent");
    addPost(content);
  };

  return (
    <form
      className="mb-4 bg-white rounded-lg shadow p-4"
      onSubmit={handleAddPost}
    >
      <textarea
        id="post-content"
        name="postContent"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        type="submit"
      >
        게시
      </button>
    </form>
  );
};
