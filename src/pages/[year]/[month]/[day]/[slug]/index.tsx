import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import { getPostById, getPostBySlug, getPosts } from "api/posts";
import { Post as PostPageProps } from "api/posts.types";
import { Post } from "components/post/Post";
import { usePreviewModeExit } from "hooks/usePreviewModeExit";
import { MAX_PAGINATION_SIZE } from "utils/constants";

const PostPage = (post: PostPageProps) => {
  usePreviewModeExit();

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Post post={post} isExcerpt={false} />
    </>
  );
};

export default PostPage;

interface Params extends ParsedUrlQuery {
  year: string;
  month: string;
  day: string;
  slug: string;
}

type PreviewData = {
  id: number;
  headers: { "X-WP-Nonce": string; Cookie: string };
};

export const getStaticProps: GetStaticProps<PostPageProps, Params, PreviewData> = async (ctx) => {
  if (ctx.preview && ctx.previewData) {
    const { id, headers } = ctx.previewData;

    const {
      data: { post: post },
    } = await getPostById(id, { headers });

    return { props: post };
  }

  if (!ctx.params || !ctx.params.slug) {
    return { notFound: true };
  }

  const {
    data: { post: props },
  } = await getPostBySlug(ctx.params.slug);

  return { props };
};

async function getAllPosts(): Promise<{ date: string; slug: string }[]> {
  async function getAllPostsWithAcc(
    page: number,
    acc: Promise<{ date: string; slug: string }[]>
  ): Promise<{ date: string; slug: string }[]> {
    const {
      data: {
        posts: {
          edges,
          pageInfo: {
            offsetPagination: { total },
          },
        },
      },
    } = await getPosts(page, MAX_PAGINATION_SIZE);
    const totalPages = Math.ceil(total / MAX_PAGINATION_SIZE);
    const posts = [...(await acc), ...edges.map(({ node: { date, slug } }) => ({ date, slug }))];
    return page === totalPages ? posts : getAllPostsWithAcc(page + 1, Promise.resolve(posts));
  }
  return getAllPostsWithAcc(1, Promise.resolve([]));
}

export async function getStaticPaths() {
  const posts = await getAllPosts();

  return {
    paths: posts.map(({ slug, date }) => ({
      params: {
        year: format(parseISO(date), "yyyy"),
        month: format(parseISO(date), "MM"),
        day: format(parseISO(date), "dd"),
        slug,
      },
    })),
    fallback: false,
  };
}
