/** @jsx createVNode */
import { createVNode } from "../../lib";
import { userStorage } from "../../storages";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const user = userStorage.get();
  const postSubmitHandler = (e) => {
    const author = user.username;
    const content = document.getElementById("post-content").value;
    const likeUsers = [];
    const time = Date.now();

    const state = globalStore.getState();
    const id = Math.max(...state.posts.map((post) => post.id)) + 1;

    state.posts = [...state.posts, { id, author, time, content, likeUsers }];
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
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={postSubmitHandler}
      >
        게시
      </button>
    </form>
  );
};
