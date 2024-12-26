export interface UserProfile {
  username: string;
  email?: string;
  bio?: string;
}

export interface GlobalStoreState {
  currentUser: UserProfile | null;
  loggedIn: boolean;
  posts: PostData[];
  error: Error | null;
}

export interface PostData {
  id: number;
  author: string;
  time: number;
  content: string;
  likeUsers: string[];
}
