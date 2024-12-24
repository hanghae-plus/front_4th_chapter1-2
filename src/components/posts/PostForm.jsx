/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";
import { userStorage } from "../../storages";

export const PostForm = () => {
  const postSubmit = () => {
    const content = document.getElementById("post-content").value;
    const state = globalStore.getState();
    const id = Math.max(...state.posts.map((post) => post.id)) + 1 || 1;
    const author = userStorage.get().username;
    const time = Date.now();

    const newPost = {
      id: id,
      author: author,
      time: time,
      content: content,
      likeUsers: [],
    };

    state.posts = [...state.posts, newPost];
    globalStore.setState(state);
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
        type="button"
        onClick={postSubmit}
      >
        게시
      </button>
    </div>
  );
};
