import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import { getPostBySlug, getPosts } from "api/posts";
import { MAX_PAGINATION_SIZE } from "utils/constants";

import { PostProps } from "components/post/Post.types";
import { Post } from "components/post/Post";

type PostPageProps = PostProps["post"];

const PostPage = (post: PostPageProps) => (
  <>
    <Head>
      <title>{post.title}</title>
    </Head>
    <Post post={post} isExcerpt={false} />
  </>
);

export default PostPage;

interface Params extends ParsedUrlQuery {
  year: string;
  month: string;
  day: string;
  slug: string;
}

export const getStaticProps: GetStaticProps<PostPageProps, Params> = async ({ params }) => {
  if (!params || !params.slug) {
    return { notFound: true };
  }

  const {
    data: { post: props },
  } = await getPostBySlug(params.slug);

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
