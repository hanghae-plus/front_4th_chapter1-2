/** @jsx createVNode */
import { createVNode } from "../../libs";
import { postFormStore } from "../../stores/postFormStore";

interface PostFormProps {
  onSubmit: (content: string) => void;
}

export const PostForm = ({ onSubmit }: PostFormProps) => {
  const { content: textareaValue } = postFormStore.getState();

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    onSubmit(textareaValue);
    postFormStore.actions.reset();
  };

  const handleChange = (event: Event) => {
    if (!event?.target) return;

    postFormStore.setState({
      content: (event.target as HTMLTextAreaElement).value,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 bg-white rounded-lg shadow p-4"
    >
      <textarea
        id="post-content"
        name="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
        onChange={handleChange}
      >
        {textareaValue}
      </textarea>
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </form>
  );
};
