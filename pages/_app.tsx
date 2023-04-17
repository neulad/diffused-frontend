import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import merge from 'lodash.merge';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
} from '@rainbow-me/rainbowkit';
import { Session } from 'next-auth';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
} from '@apollo/client';

const queryClient = new QueryClient();

const { chains, provider } = configureChains(
  [chain.goerli, chain.mainnet, chain.optimism],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'DiffusedMarket',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
});

const customRainbowTheme = merge(darkTheme(), {
  fonts: { body: 'Inter' },
  colors: {
    accentColor: '#5F5AFA',
    connectButtonBackground: '#1a1b1f',
    connectButtonInnerBackground: '#28292c',
  },
} as Theme);

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <SessionProvider refetchInterval={0} session={session}>
          <RainbowKitSiweNextAuthProvider>
            <ApolloProvider client={apolloClient}>
              <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                  chains={chains}
                  theme={customRainbowTheme}
                  modalSize="compact"
                  initialChain={chain.goerli}
                >
                  <Component {...pageProps} />
                </RainbowKitProvider>
              </QueryClientProvider>
            </ApolloProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </WagmiConfig>
      <ToastContainer />
    </>
  );
}

export default App;
