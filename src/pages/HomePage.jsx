/** @jsx createVNode */
import { createVNode } from "../lib";
import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";

export const HomePage = () => {
  const { posts, loggedIn, currentUser } = globalStore.getState();

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
                const isLiked =
                  loggedIn && post.likeUsers.includes(currentUser?.username);
                return (
                  <Post key={post.id} {...post} activationLike={isLiked} />
                );
              })}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
