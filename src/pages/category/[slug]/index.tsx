import { GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

import { getAllCategories } from "api/categories";
import { MAX_PAGINATION_SIZE } from "utils/constants";

import CategoryArchive, { CategoryArchiveProps, getStaticProps as getCategoryPageStaticProps } from "./page/[page]";

export default CategoryArchive;

export const getStaticPaths = async () => {
  const {
    data: {
      categories: { edges },
    },
  } = await getAllCategories(MAX_PAGINATION_SIZE);

  return {
    paths: edges.map(({ node: { slug } }) => ({ params: { slug } })),
    fallback: false,
  };
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<CategoryArchiveProps, Params> = async (ctx) =>
  ctx.params ? getCategoryPageStaticProps({ ...ctx, params: { page: "1", ...ctx.params } }) : { notFound: true };
