/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { currentUser } = globalStore.getState();
  const handleAddPost = () => {
    const content = document.getElementById("post-content").value;
    globalStore.setState({
      posts: [
        {
          id: Date.now(),
          author: currentUser.username,
          time: Date.now(),
          content,
          likeUsers: [],
        },
        ...globalStore.getState().posts,
      ],
    });
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
        onClick={handleAddPost}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </div>
  );
};
