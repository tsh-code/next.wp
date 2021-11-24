import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";

import { getAllUsers } from "api/users";
import { MAX_PAGINATION_SIZE } from "utils/constants";

import AuthorArchive, { AuthorArchiveProps, getStaticProps as getAuthorPageStaticProps } from "./page/[page]";

export default AuthorArchive;

export const getStaticPaths = async () => {
  const {
    data: {
      users: { edges },
    },
  } = await getAllUsers(MAX_PAGINATION_SIZE);

  return {
    paths: edges.map(({ node: { slug } }) => ({ params: { slug } })),
    fallback: false,
  };
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<AuthorArchiveProps, Params> = async (ctx) =>
  ctx.params ? getAuthorPageStaticProps({ ...ctx, params: { page: "1", ...ctx.params } }) : { notFound: true };
