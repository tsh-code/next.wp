import graphQL from "./graphql";

export async function getAllCategories(first: number): Promise<{ data: { categories: { edges: { node: { slug: string } }[] } } }> {
  return graphQL(
    `
    query GetAllCategories($first: Int!) {
      categories(first: $first) {
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
