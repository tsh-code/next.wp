import { GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import { getPostsByTag } from "api/posts";
import { PostsArchive } from "components/postsArchive/PostsArchive";
import { PostsArchiveProps } from "components/postsArchive/PostsArchive.types";
import { POSTS_PER_PAGE } from "utils/constants";

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

export const getStaticPaths = async () => ({ paths: [], fallback: "blocking" });

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

  return edges.length > 0
    ? {
        props: {
          tag: tag.name,
          posts: edges.map(({ node }) => node),
          pagination: {
            currentPage: page,
            totalPages,
            href: `/tag/${slug}/`,
          },
        },
      }
    : { notFound: true };
};
