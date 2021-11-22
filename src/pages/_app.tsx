import "../styles/globals.css";
import type { AppProps } from "next/app";

export const MyApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default MyApp;
