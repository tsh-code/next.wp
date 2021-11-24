import { Post as PostType } from "api/posts.types";

type Post = PostType & { id: string };

type Pagination = {
  currentPage: number;
  totalPages: number;
  href: string;
};

export type PostsArchiveProps = {
  posts: Post[];
  pagination: Pagination;
};
