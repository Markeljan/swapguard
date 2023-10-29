import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig, task } from "hardhat/config";
// @ts-ignore
import "./tasks/frontRunAttack";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
import intercept from "intercept-stdout";
// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const frontRunnerPrivateKey =
  process.env.FRONTRUNNER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';

task("frontRunAttack", "Execute a front-running attack")

// Override solc compile task and filter out useless warnings
task(TASK_COMPILE)
  .setAction(async (args, hre, runSuper) => {
    intercept((text: any) => {
      if (/MockContract.sol/.test(text) && text.match(/Warning: SPDX license identifier not provided in source file/)) return '';
      if (/MockContract.sol/.test(text) &&
        /Warning: This contract has a payable fallback function, but no receive ether function/.test(text)) return '';
      return text;
    });
    await runSuper(args);
  });


const config: HardhatUserConfig = {
  etherscan: {
    customChains: [
      {
        network: "coston",
        chainId: 16,
        urls: {
          apiURL: "https://coston-explorer.flare.network/api",
          browserURL: "https://coston-explorer.flare.network"
        }
      },
      {
        network: "coston2",
        chainId: 114,
        urls: {
          apiURL: "https://coston2-explorer.flare.network/api",
          browserURL: "https://coston2-explorer.flare.network"
        }
      },
      {
        network: "flare",
        chainId: 14,
        urls: {
          apiURL: "https://flare-explorer.flare.network/api",
          browserURL: "https://flare-explorer.flare.network/",
        }
      }
    ]
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          evmVersion: "london",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],
    overrides: {
      "contracts/Imports060.sol": {
        version: "0.6.6",
        settings: {
        }
      },
      "@gnosis.pm/mock-contract/contracts/MockContract.sol": {
        version: "0.6.6",
        settings: {
        }
      },
    }
  },
  defaultNetwork: "coston2",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
    frontRunAcc: {
      default: 1,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey, frontRunnerPrivateKey],
    },
    coston: {
      url: "https://coston-api.flare.network/ext/bc/C/rpc",
      accounts: [deployerPrivateKey, frontRunnerPrivateKey],
      chainId: 16,
      verifyURL: "https://coston-explorer.flare.network",
      verify: {
        etherscan: {
          apiKey: `${etherscanApiKey}`,
          apiUrl: "https://coston-explorer.flare.network",
        }
      }
    },
    coston2: {
      url: "https://coston2-api.flare.network/ext/bc/C/rpc",
      accounts: [deployerPrivateKey, frontRunnerPrivateKey],
      chainId: 114,
      verifyURL: "https://coston2-explorer.flare.network",
      verify: {
        etherscan: {
          apiKey: `${etherscanApiKey}`,
          apiUrl: "https://coston2-explorer.flare.network",
        }
      }
    },
    flare: {
      url: "https://flare-api.flare.network/ext/C/rpc",
      accounts: [deployerPrivateKey, frontRunnerPrivateKey],
      chainId: 14,
      verifyURL: "https://flare-explorer.flare.network",
      verify: {
        etherscan: {
          apiKey: `${etherscanApiKey}`,
          apiUrl: "https://flare-explorer.flare.network",
        }
    }
  },
},
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
};

export default config;
