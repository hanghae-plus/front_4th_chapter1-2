/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore";

export const PostForm = () => {
  const { getState, setState } = globalStore;
  const { currentUser, posts } = getState();

  const submitPost = () => {
    const contentEl = document.querySelector("#post-content");
    const content = contentEl.value.trim();

    if (!currentUser || !content) return;

    const newPosts = [
      ...posts,
      {
        id: posts.length + 1,
        author: currentUser?.username,
        time: new Date().getTime(),
        content,
        likeUsers: [],
      },
    ];

    setState({ posts: newPosts });
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
        onClick={submitPost}
      >
        게시
      </button>
    </div>
  );
};
