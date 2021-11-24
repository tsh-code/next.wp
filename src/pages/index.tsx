import { GetStaticPropsContext } from "next";

import ArchivesPage, { getStaticProps as getPostsArchiveStaticProps } from "pages/page/[page]";

export default ArchivesPage;

export const getStaticProps = async (ctx: GetStaticPropsContext<{}>) =>
  getPostsArchiveStaticProps({ ...ctx, params: { page: "1", ...ctx.params } });
