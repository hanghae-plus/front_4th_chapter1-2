/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { currentUser } = globalStore.getState();
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = (
      document.getElementById("post-content") as HTMLTextAreaElement
    )?.value;
    if (content == null) return;

    const now = new Date();

    const post = {
      id: now.getTime(),
      key: now.getTime(),
      content,
      time: now,
      likeUsers: [],
      author: currentUser.username,
    };

    globalStore.setState({
      posts: [post, ...globalStore.getState().posts],
    });

    (document.getElementById("post-content") as HTMLTextAreaElement).value = "";
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
