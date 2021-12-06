import { Element } from "domhandler/lib/node";
import parseHTML, { domToReact, HTMLReactParserOptions } from "html-react-parser";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { ParsedUrlQuery } from "querystring";

import { getPageBySlug, getPages } from "api/pages";
import { getPostById } from "api/posts";
import { Post } from "api/posts.types";
import { usePreviewModeExit } from "hooks/usePreviewModeExit";
import { MAX_PAGINATION_SIZE } from "utils/constants";

import styles from "./Page.module.scss";

type PageProps = Pick<Post, "title" | "slug" | "content">;

const figureParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.name === "a") {
      const [image] = domNode.children;
      const { alt, width, height } = (image as Element).attribs;

      return <Image src={domNode.attribs.href} alt={alt} width={width} height={height} />;
    }
  },
};

const Page = (page: PageProps) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "figure" && domNode.attribs.class.includes("wp-block-image")) {
        return <figure>{domToReact(domNode.children, figureParserOptions)}</figure>;
      }
    },
  };

  usePreviewModeExit();

  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      <article>
        <header className={styles.header}>
          <h1 className={styles.title}>{page.title}</h1>
        </header>
        <div className={styles.content}>{parseHTML(page.content, options)}</div>
      </article>
    </>
  );
};

export default Page;

interface Params extends ParsedUrlQuery {
  slug: string[];
}

type PreviewData = {
  id: number;
  headers: { "X-WP-Nonce": string; Cookie: string };
};

export const getStaticProps: GetStaticProps<PageProps, Params, PreviewData> = async (ctx) => {
  if (ctx.preview && ctx.previewData) {
    const { id, headers } = ctx.previewData;

    const {
      data: { post: page },
    } = await getPostById(id, { headers });

    return { props: page };
  }

  if (!ctx.params || !ctx.params.slug) {
    return { notFound: true };
  }

  const {
    data: { pageBy: props },
  } = await getPageBySlug(ctx.params.slug.join("/"));

  return { props };
};

async function getAllPages(): Promise<{ slug: string }[]> {
  async function getAllPagesWithAcc(page: number, acc: Promise<{ slug: string }[]>): Promise<{ slug: string }[]> {
    const {
      data: {
        pages: {
          edges,
          pageInfo: {
            offsetPagination: { total },
          },
        },
      },
    } = await getPages(page, MAX_PAGINATION_SIZE);
    const totalPages = Math.ceil(total / MAX_PAGINATION_SIZE);
    const posts = [...(await acc), ...edges.map(({ node: { slug } }) => ({ slug }))];
    return page === totalPages ? posts : getAllPagesWithAcc(page + 1, Promise.resolve(posts));
  }
  return getAllPagesWithAcc(1, Promise.resolve([]));
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getAllPages();

  return {
    paths: pages.map(({ slug }) => ({ params: { slug: slug.split("/") } })),
    fallback: false,
  };
};
