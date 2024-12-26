/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";
import { toTimeFormat } from "../../utils";

export const PostForm = () => {
  const addPost = () => {
    const content = document.getElementById("post-content").value;
    const { currentUser, posts } = globalStore.getState();

    globalStore.setState({
      posts: [
        {
          id: Date.now(),
          author: currentUser.username,
          time: Date.now(),
          content: content,
          likeUsers: [],
        },
        ...posts,
      ],
    });
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
        onClick={addPost}
      >
        게시
      </button>
    </div>
  );
};
