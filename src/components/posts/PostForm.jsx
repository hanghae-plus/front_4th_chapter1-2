/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/index.js";

export const PostForm = () => {
  const handleSubmit = () => {
    const content = document.getElementById("post-content").value;
    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }
    const { posts, currentUser } = globalStore.getState();
    const newPost = {
      id: posts.length + 1,
      author: currentUser?.username,
      time: Date.now(),
      content,
      likeUsers: [],
    };

    globalStore.setState({ posts: [...posts, newPost] });
  };
  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleSubmit}
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </div>
  );
};
