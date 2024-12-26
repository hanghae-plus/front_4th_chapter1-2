/** @jsx createVNode */
import { createVNode } from "../lib";
import { addEvent } from "../lib/";
import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";
import { userStorage } from "../storages";
import { postStore } from "../stores";

/**
 * 심화과제
 * - 로그인한 사용자는 게시물을 추가할 수 있다.
 * - 로그인한 사용자는 게시물에 좋아요를 누를 수 있다.
 * - 로그인하지 않은 사용자가 게시물에 좋아요를 누를 경우, "로그인 후 이용해주세요"를 alert로 띄운다.
 */
export const HomePage = () => {
  console.log("HomePage 렌더링");
  const { posts, loggedIn } = globalStore.getState();

  const handleLike = (index) => {
    const currentUser = userStorage.get();
    if (!currentUser) {
      alert("로그인 후 이용해주세요");
      return;
    }

    postStore.actions.toggleLike(index, currentUser.username);
  };

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
              .map((props, index) => {
                const currentUser = userStorage.get()?.username;
                const activationLike = currentUser
                  ? props.likeUsers.includes(currentUser)
                  : false;
                return (
                  <Post
                    {...props}
                    activationLike={activationLike}
                    onLike={() => handleLike(index)}
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
