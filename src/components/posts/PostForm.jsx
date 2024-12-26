/** @jsx createVNode */
import { createVNode } from "@lib";
import { globalStore } from "@stores";

export const PostForm = ({}) => {
  const { currentUser } = globalStore.getState();
  const { addPost } = globalStore.actions;
  let postContent = "";

  const handlePostContentChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    postContent = value;
  };

  const handlePostSubmit = () => {
    try {
      const textareaDOM = document.getElementById("post-content");

      if (postContent.length === 0) {
        alert("내용을 입력해주세요");
        return;
      }

      const postPayload = {
        author: currentUser.username,
        content: postContent,
      };

      addPost(postPayload);

      if (textareaDOM) {
        textareaDOM.value = "";
      }
      postContent = "";
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);
      alert("게시글 작성 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
        onChange={handlePostContentChange}
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handlePostSubmit}
      >
        게시
      </button>
    </div>
  );
};
