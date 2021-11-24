import graphQL from "./graphql";

export async function getAllUsers(first: number): Promise<{ data: { users: { edges: { node: { slug: string } }[] } } }> {
  return graphQL(
    `
    query GetAllUsers($first: Int!) {
      users(first: $first) {
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
