import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Head from "next/head";

const queryClient = new QueryClient();

/**
 * Standard Next.js App component that wraps the entire application.
 * It uses the react-query QueryClientProvider to provide the query client
 * to all pages and components.
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Polygon ID Demo</title>
        <meta
          name="description"
          content="A starter kit for building full-stack applications with Polygon ID."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}
