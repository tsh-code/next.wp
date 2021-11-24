import { GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import { getPostsByTag } from "api/posts";
import { getAllTags } from "api/tags";
import { PostsArchive } from "components/postsArchive/PostsArchive";
import { PostsArchiveProps } from "components/postsArchive/PostsArchive.types";
import { MAX_PAGINATION_SIZE, POSTS_PER_PAGE } from "utils/constants";

export type TagArchiveProps = PostsArchiveProps & {
  tag: string;
};

const TagArchive = ({ tag, ...props }: TagArchiveProps) => (
  <>
    <Head>
      <title>{tag}</title>
    </Head>
    <PostsArchive {...props} />
  </>
);

export default TagArchive;

export const getStaticPaths = async () => {
  const {
    data: {
      tags: { edges },
    },
  } = await getAllTags(MAX_PAGINATION_SIZE);
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
      } = await getPostsByTag(slug, 1, POSTS_PER_PAGE);
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

export const getStaticProps: GetStaticProps<TagArchiveProps, Params> = async ({ params }) => {
  if (!params || !params.page || !params.slug) {
    return { notFound: true };
  }

  const page = parseInt(params.page);
  const slug = params.slug;

  const {
    data: {
      tag,
      posts: {
        edges,
        pageInfo: {
          offsetPagination: { total },
        },
      },
    },
  } = await getPostsByTag(slug, page, POSTS_PER_PAGE);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return {
    props: {
      tag: tag.name,
      posts: edges.map(({ node }) => node),
      pagination: {
        currentPage: page,
        totalPages,
        href: `/tag/${slug}/`,
      },
    },
  };
};
