export type Post = {
  id: number;
  author: string;
  time: number;
  content: string;
  likeUsers: [];
  activationLike?: boolean;
};
