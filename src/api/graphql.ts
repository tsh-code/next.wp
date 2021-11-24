import axios from "axios";

const client = axios.create({ baseURL: process.env.WP_API_URL });

client.interceptors.response.use(
  ({ data }) => data,
  (error) => Promise.reject(error)
);

function graphQL(query: string, variables: Record<string, any>) {
  return client.post("/", { query, variables });
}

export default graphQL
