import { GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import { getPostsByCategory } from "api/posts";
import { PostsArchive } from "components/postsArchive/PostsArchive";
import { PostsArchiveProps } from "components/postsArchive/PostsArchive.types";
import { POSTS_PER_PAGE } from "utils/constants";

export type CategoryArchiveProps = PostsArchiveProps & {
  category: string;
};

const CategoryArchive = ({ category, ...props }: CategoryArchiveProps) => (
  <>
    <Head>
      <title>{category}</title>
    </Head>
    <PostsArchive {...props} />
  </>
);

export default CategoryArchive;

export const getStaticPaths = async () => ({ paths: [], fallback: "blocking" });

interface Params extends ParsedUrlQuery {
  slug: string;
  page: string;
}

export const getStaticProps: GetStaticProps<CategoryArchiveProps, Params> = async ({ params }) => {
  if (!params || !params.page || !params.slug) {
    return { notFound: true };
  }

  const page = parseInt(params.page);
  const slug = params.slug;

  const {
    data: {
      category,
      posts: {
        edges,
        pageInfo: {
          offsetPagination: { total },
        },
      },
    },
  } = await getPostsByCategory(slug, page, POSTS_PER_PAGE);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return edges.length > 0
    ? {
        props: {
          category: category.name,
          posts: edges.map(({ node }) => node),
          pagination: {
            currentPage: page,
            totalPages,
            href: `/category/${slug}/`,
          },
        },
      }
    : { notFound: true };
};
