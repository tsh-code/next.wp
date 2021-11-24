import { GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

import { getAllTags } from "api/tags";
import { MAX_PAGINATION_SIZE } from "utils/constants";

import TagArchive, { TagArchiveProps, getStaticProps as getTagPageStaticProps } from "./page/[page]";

export default TagArchive;

export const getStaticPaths = async () => {
  const {
    data: {
      tags: { edges },
    },
  } = await getAllTags(MAX_PAGINATION_SIZE);

  return {
    paths: edges.map(({ node: { slug } }) => ({ params: { slug } })),
    fallback: false,
  };
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<TagArchiveProps, Params> = async (ctx) =>
  ctx.params ? getTagPageStaticProps({ ...ctx, params: { page: "1", ...ctx.params } }) : { notFound: true };
