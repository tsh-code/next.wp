import { GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import { getAllCategories } from "api/categories";
import { getPostsByCategory } from "api/posts";
import { PostsArchive } from "components/postsArchive/PostsArchive";
import { PostsArchiveProps } from "components/postsArchive/PostsArchive.types";
import { MAX_PAGINATION_SIZE, POSTS_PER_PAGE } from "utils/constants";

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

export const getStaticPaths = async () => {
  const {
    data: {
      categories: { edges },
    },
  } = await getAllCategories(MAX_PAGINATION_SIZE);
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
      } = await getPostsByCategory(slug, 1, POSTS_PER_PAGE);
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

  return {
    props: {
      category: category.name,
      posts: edges.map(({ node }) => node),
      pagination: {
        currentPage: page,
        totalPages,
        href: `/category/${slug}/`,
      },
    },
  };
};
