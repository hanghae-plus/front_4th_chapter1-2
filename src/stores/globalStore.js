import { createStore } from "../lib";
import { userStorage } from "../storages";

const 초 = 1000;
const 분 = 초 * 60;
const 시간 = 분 * 60;

export const globalStore = createStore(
  {
    currentUser: userStorage.get(),
    loggedIn: Boolean(userStorage.get()),
    posts: [
      {
        id: 1,
        author: "홍길동",
        time: Date.now() - 5 * 분,
        content: "오늘 날씨가 정말 좋네요. 다들 좋은 하루 보내세요!",
        likeUsers: [],
      },
      {
        id: 2,
        author: "김철수",
        time: Date.now() - 15 * 분,
        content: "새로운 프로젝트를 시작했어요. 열심히 코딩 중입니다!",
        likeUsers: [],
      },
      {
        id: 3,
        author: "이영희",
        time: Date.now() - 30 * 분,
        content: "오늘 점심 메뉴 추천 받습니다. 뭐가 좋을까요?",
        likeUsers: [],
      },
      {
        id: 4,
        author: "박민수",
        time: Date.now() - 30 * 분,
        content: "주말에 등산 가실 분 계신가요? 함께 가요!",
        likeUsers: [],
      },
      {
        id: 5,
        author: "정수연",
        time: Date.now() - 2 * 시간,
        content: "새로 나온 영화 재미있대요. 같이 보러 갈 사람?",
        likeUsers: [],
      },
    ],
    error: null,
  },
  {
    logout(state) {
      userStorage.reset();
      return { ...state, currentUser: null, loggedIn: false };
    },
    toggleLike(state, id) {
      const { posts, loggedIn, currentUser } = state;

      if (!loggedIn) {
        alert("로그인 후 이용해주세요");
        return;
      }

      const { username } = currentUser;

      const newPosts = posts.map((post) => {
        if (post.id !== id) return post;

        const likeUsers = post.likeUsers.includes(username)
          ? post.likeUsers.filter((user) => user !== username)
          : [...post.likeUsers, username];

        return { ...post, likeUsers };
      });
      return { ...state, posts: newPosts };
    },
    addPost(state, content) {
      const { currentUser, posts } = state;
      const newPost = {
        id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
        author: currentUser.username,
        time: Date.now(),
        content,
        likeUsers: [],
      };
      return { ...state, posts: [...posts, newPost] };
    },
  },
);
