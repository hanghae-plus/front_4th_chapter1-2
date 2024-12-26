/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  // JSON으로 변환해야 꺼내 사용할 수 있다
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleSubmit = () => {
    const content = document.getElementById("post-content").value;
    if (!content) return;

    const { posts } = globalStore.getState();
    const newPost = {
      id: posts.length + 1,
      author: user?.username,
      time: Date.now(),
      content,
      likeUsers: [],
    };

    globalStore.setState({ posts: [newPost, ...posts] });
    document.getElementById("post-content").value = "";
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
        onClick={handleSubmit}
      >
        게시
      </button>
    </div>
  );
};
