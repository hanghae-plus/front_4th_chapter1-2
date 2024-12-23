/** @jsx createVNode */
import { createVNode } from "../../lib";
import { userStorage } from "../../storages";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const postSubmitHandler = () => {
    const state = globalStore.getState();

    const newPost = {
      id: Math.max(...state.posts.map((post) => post.id)) + 1 || 1,
      author: userStorage.get().username,
      time: Date.now(),
      content: document.getElementById("post-content").value,
      likeUsers: [],
    };

    state.posts = [...state.posts, newPost];
    globalStore.setState(state);
  };
  return (
    <form className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        type="button"
        onClick={postSubmitHandler}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </form>
  );
};
