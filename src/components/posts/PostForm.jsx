/** @jsx createVNode */
import { createVNode } from "../../lib";
import { addEvent, removeEvent } from "../../lib/";
import { postStore } from "../../stores";
import { userStorage } from "../../storages";

export const PostForm = () => {
  const handleSubmit = () => {
    console.log("포스트 작성 이벤트 등록");
    const content = document.getElementById("post-content").value;
    if (!content.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }

    postStore.actions.addPost({
      author: userStorage.get().username,
      time: new Date(),
      content: content,
      likeUsers: [],
    });

    // 입력창 초기화
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
