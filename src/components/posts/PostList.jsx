/** @jsx createVNode */
import { createVNode } from "@/lib";
import { globalStore } from "@/stores";
import { Post } from "@/components/posts";

export const PostList = () => {
  const { posts } = globalStore.getState();

  return (
    <div id="posts-container" className="space-y-4">
      {[...posts]
        .sort((a, b) => b.time - a.time)
        .map((props) => (
          <Post {...props} />
        ))}
    </div>
  );
};
