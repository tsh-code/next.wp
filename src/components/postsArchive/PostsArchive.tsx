import { Pagination } from "components/pagination/Pagination";
import { Post } from "components/post/Post";

import { PostsArchiveProps } from "./PostsArchive.types";
import styles from "./PostsArchive.module.scss";
import { getExcerptFromContent } from "./PostsArchive.utils";

export const PostsArchive = ({ posts, pagination }: PostsArchiveProps) => (
  <div>
    <div>
      {posts.map(({ content, ...post }) => (
        <Post key={post.id} post={{ ...post, content: getExcerptFromContent(content) }} isExcerpt />
      ))}
    </div>
    {pagination.totalPages > 1 && <Pagination {...pagination} className={styles.pagination} />}
  </div>
);
