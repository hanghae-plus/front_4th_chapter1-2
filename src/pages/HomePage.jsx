/** @jsx createVNode */
import { createVNode } from "@/lib";
import { Footer, Header, Navigation, PostList, PostForm } from "@/components";
import { globalStore } from "@/stores";

export const HomePage = () => {
  const { loggedIn } = globalStore.getState();

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />
        <main className="p-4">
          {loggedIn && <PostForm />}
          <PostList />
        </main>
        <Footer />
      </div>
    </div>
  );
};
