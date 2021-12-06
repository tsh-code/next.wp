import axios, { AxiosRequestConfig } from "axios";

const client = axios.create({ baseURL: `${process.env.WP_PROTOCOL}://${process.env.WP_DOMAIN}/graphql` });

client.interceptors.response.use(
  ({ data }) => data,
  (error) => Promise.reject(error)
);

function graphQL(query: string, variables: Record<string, any>, options?: AxiosRequestConfig) {
  return client.post("/", { query, variables }, options);
}

export default graphQL
