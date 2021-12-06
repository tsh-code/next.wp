import { AxiosRequestConfig } from "axios";

import graphQL from "./graphql";

export async function getPageBySlug(slug: string) {
  return graphQL(
    `query PageBySlug($slug: String!) {
      pageBy(uri: $slug) {
        title
        content(format: RENDERED)
        slug
      }
    }`,
    { slug }
  );
}

export async function getPageRevisions(id: number, options?: AxiosRequestConfig): Promise<{data: {page: {revisions: {edges: {node: {databaseId: number, isPreview: boolean}}[]}}}}> {
  return graphQL(
    `query PostRevisions($id: ID!) {
      page(id: $id, idType: DATABASE_ID) {
        revisions {
          edges {
            node {
              databaseId
              isPreview
            }
          }
        }
      }
    }`,
    { id },
    options
  );
}

export async function getPages(page: number, perPage: number): Promise<{ data: { pages: { edges: { node: { title: string, slug: string } }[], pageInfo: { offsetPagination: { total: number }} } } }> {
  return graphQL(
    `
    query AllPages($size: Int!, $offset: Int!) {
      pages(where: {offsetPagination: { size: $size, offset: $offset }}) {
        edges {
          node {
            title
            slug
          }
        }
        pageInfo {
          offsetPagination {
            total
          }
        }
      }
    }
  `,
    { offset: (page - 1) * perPage, size: perPage }
  );
}
