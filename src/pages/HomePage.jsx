/** @jsx createVNode */
import { createVNode } from "../lib";

import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";

export const HomePage = () => {
  const { posts, loggedIn, currentUser } = globalStore.getState();
  const { toggleLike } = globalStore.actions;

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn && <PostForm />}
          <div id="posts-container" className="space-y-4">
            {[...posts]
              .sort((a, b) => b.time - a.time)
              .map((post) => {
                return (
                  <Post
                    {...post}
                    activationLike={post.likeUsers?.includes(
                      currentUser?.username,
                    )}
                    onLikeClick={() => toggleLike(post.id)}
                  />
                );
              })}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
