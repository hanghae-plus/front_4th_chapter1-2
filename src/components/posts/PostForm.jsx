/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore.js";

export const PostForm = () => {
  const { loggedIn, currentUser } = globalStore.getState();
  const { setState } = globalStore;

  let postContent = "";

  const handleTextareaChange = (e) => {
    postContent = e.target.value; // 텍스트를 업데이트
  };

  const handlePostSubmit = () => {
    if (!postContent.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }

    const newPost = {
      id: Date.now(), // 고유 ID
      author: currentUser.username, // 로그인한 사용자
      time: Date.now(), // 현재 시간
      content: postContent.trim(), // 작성된 내용
      likeUsers: [], // 좋아요 초기화
    };

    // 상태 업데이트
    const updatedPosts = [newPost, ...globalStore.getState().posts];
    setState({ posts: updatedPosts });

    // 텍스트 초기화
    document.querySelector("#post-content").value = "";
    postContent = "";
  };

  if (loggedIn) {
    return (
      <div className="mb-4 bg-white rounded-lg shadow p-4">
        <textarea
          id="post-content"
          placeholder="무슨 생각을 하고 계신가요?"
          className="w-full p-2 border rounded"
          onChange={handleTextareaChange}
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
  }
};
