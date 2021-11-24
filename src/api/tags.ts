import graphQL from "./graphql";

export async function getAllTags(first: number): Promise<{ data: { tags: { edges: { node: { slug: string } }[] } } }> {
  return graphQL(
    `
    query GetAllTags($first: Int!) {
      tags(first: $first) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `,
    { first }
  );
}
