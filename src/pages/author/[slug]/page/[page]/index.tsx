import { GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import { getPostsByAuthor } from "api/posts";
import { getAllUsers } from "api/users";
import { PostsArchive } from "components/postsArchive/PostsArchive";
import { PostsArchiveProps } from "components/postsArchive/PostsArchive.types";
import { MAX_PAGINATION_SIZE, POSTS_PER_PAGE } from "utils/constants";

export type AuthorArchiveProps = PostsArchiveProps & {
  author: string;
};

const AuthorArchive = ({ author, ...props }: AuthorArchiveProps) => (
  <>
    <Head>
      <title>Posty użytkownika {author}</title>
    </Head>
    <PostsArchive {...props} />
  </>
);

export default AuthorArchive;

export const getStaticPaths = async () => ({ paths: [], fallback: "blocking" });

interface Params extends ParsedUrlQuery {
  slug: string;
  page: string;
}

export const getStaticProps: GetStaticProps<AuthorArchiveProps, Params> = async ({ params }) => {
  if (!params || !params.page) {
    return { notFound: true };
  }

  const page = parseInt(params.page);
  const { slug } = params;

  const {
    data: {
      user,
      posts: {
        edges,
        pageInfo: {
          offsetPagination: { total },
        },
      },
    },
  } = await getPostsByAuthor(slug, page, POSTS_PER_PAGE);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return edges.length > 0
    ? {
        props: {
          author: user.name,
          posts: edges.map(({ node }) => node),
          pagination: {
            currentPage: page,
            totalPages,
            href: `/author/${slug}/`,
          },
        },
      }
    : { notFound: true };
};
