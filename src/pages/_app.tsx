import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Head from "next/head";
import { polygonMumbai, polygon } from "wagmi/chains";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { LensProvider, LensConfig, production, development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";

const queryClient = new QueryClient();

const { publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  // [polygonMumbai, polygon],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({
      options: {
        shimDisconnect: false,
      },
    }),
  ],
});

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  // environment: production,
  environment: development,
};

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
        <WagmiConfig config={config}>
          <LensProvider config={lensConfig}>
            <Component {...pageProps} />
          </LensProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </>
  );
}
