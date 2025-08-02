export interface PostAuthor {
  _id: string;
  name: string;
  email: string;
}

export interface PostData {
  _id: string;
  content: string;
  author: PostAuthor;
  likes: string[];
  comments: string[];
  shares?: number;
  createdAt: string;
}
