export interface UserProfile {
  username: string;
  email?: string;
  bio?: string;
}

export interface GlobalStoreState {
  currentUser: UserProfile | null;
  loggedIn: boolean;
  posts: Post[];
  error: Error | null;
}

export interface Post {
  id: number;
  author: string;
  time: number;
  content: string;
  likeUsers: string[];
}
