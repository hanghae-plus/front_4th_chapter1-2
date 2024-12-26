/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/index.js";

function createContent(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  console.log("formData", formData.get("content"));
  const data = {};

  data.id = globalStore.getState().posts.length + 1;
  data.author = globalStore.getState().currentUser.username;
  data.time = Date.now();
  data.content = formData.get("content");
  data.likeUsers = [];
  globalStore.setState({ posts: [...globalStore.getState().posts, data] });
}

export const PostForm = () => {
  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <form id={"content-form"} onSubmit={createContent}>
        <textarea
          id="post-content"
          placeholder="무슨 생각을 하고 계신가요?"
          className="w-full p-2 border rounded"
          name="content"
        />
        <button
          id="post-submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          type={"submit"}
        >
          게시
        </button>
      </form>
    </div>
  );
};
