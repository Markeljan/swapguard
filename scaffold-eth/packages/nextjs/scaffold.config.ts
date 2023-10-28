import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetwork: chains.Chain;
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  walletAutoConnect: boolean;
};

const coston2Chain: chains.Chain = {
  name: "Flare Testnet Coston2",
  network: "coston2",
  nativeCurrency: {
    name: "Coston2 Ether",
    symbol: "C2FLR",
    decimals: 18,
  },
  id: 114,
  rpcUrls: {
    default: {http: ["https://coston2-api.flare.network/ext/bc/C/rpc"]},
    public: {http: ["https://coston2-api.flare.network/ext/bc/C/rpc"]},
  },
  blockExplorers: {
    default: {
      name: "flarescan",
      url: "https://testnet.flarescan.com",
    },
  },
};


const scaffoldConfig = {
  // The network where your DApp lives in
  targetNetwork: coston2Chain,

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect on the local network
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,

  /**
   * Auto connect:
   * 1. If the user was connected into a wallet before, on page reload reconnect automatically
   * 2. If user is not connected to any wallet:  On reload, connect to burner wallet if burnerWallet.enabled is true && burnerWallet.onlyLocal is false
   */
  walletAutoConnect: true,
} satisfies ScaffoldConfig;

export default scaffoldConfig;
