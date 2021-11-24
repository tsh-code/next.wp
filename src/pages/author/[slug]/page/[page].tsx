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

export const getStaticPaths = async () => {
  const {
    data: {
      users: { edges },
    },
  } = await getAllUsers(MAX_PAGINATION_SIZE);
  const paths = await edges
    .map(({ node: { slug } }) => slug)
    .reduce(async (acc: Promise<{ params: { slug: string; page: string } }[]>, slug: string) => {
      const {
        data: {
          posts: {
            pageInfo: {
              offsetPagination: { total },
            },
          },
        },
      } = await getPostsByAuthor(slug, 1, POSTS_PER_PAGE);
      const totalPages = Math.ceil(total / POSTS_PER_PAGE);

      return [
        ...(await acc),
        ...Array.from({ length: totalPages }, (_, i) => ({
          params: { slug, page: (i + 1).toString() },
        })),
      ];
    }, Promise.resolve([]));

  return { paths, fallback: false };
};

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

  return {
    props: {
      author: user.name,
      posts: edges.map(({ node }) => node),
      pagination: {
        currentPage: page,
        totalPages,
        href: `/author/${slug}/`,
      },
    },
  };
};
