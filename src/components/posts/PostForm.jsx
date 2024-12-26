/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { loggedIn, currentUser } = globalStore.getState();
  const { posts } = globalStore.getState();
  console.log("🚀 ~ PostForm ~ posts:", posts);
  if (!loggedIn) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = document.getElementById("post-content").value;
    const post = {
      id: Date.now(),
      author: currentUser.username,
      time: Date.now(),
      content,
      likeUsers: [],
    };
    posts.push(post);
    globalStore.setState({ posts });
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
