import { GetStaticPaths, GetStaticPropsContext, GetStaticPropsResult } from "next";

import { getPosts } from "api/posts";
import { PostsArchive as ArchivesPage } from "components/postsArchive/PostsArchive";
import { PostsArchiveProps } from "components/postsArchive/PostsArchive.types";
import { POSTS_PER_PAGE } from "utils/constants";

export default ArchivesPage;

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: "blocking" });

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ page: string }>): Promise<GetStaticPropsResult<PostsArchiveProps>> => {
  if (!params || !params.page) {
    return { notFound: true };
  }

  const page = parseInt(params.page);
  const {
    data: {
      posts: {
        edges,
        pageInfo: {
          offsetPagination: { total },
        },
      },
    },
  } = await getPosts(page, POSTS_PER_PAGE);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return edges.length > 0
    ? {
        props: {
          posts: edges.map(({ node }) => node),
          pagination: { currentPage: page, totalPages, href: "/" },
        },
      }
    : { notFound: true };
};
