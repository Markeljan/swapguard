import { ACTIVE_CHAIN } from "@/const/details";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId="487b5b429fa917d0a0df0e7f26bf3bc3"
      activeChain={ACTIVE_CHAIN}
      supportedChains={[ACTIVE_CHAIN]}
    >
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}
