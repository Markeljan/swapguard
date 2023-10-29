import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const tokenList = ["WETH", "USDC"];

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployTokens: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  for (const contractName of tokenList) {
    const deployTx = await deploy(contractName, {
      from: deployer,
      // Contract constructor arguments
      args: [],
      log: true,
      // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
      // automatically mining the contract deployment transaction. There is no effect on live networks.
      autoMine: true,
    });

    if(deployTx.receipt?.status !== 1) {
      console.log(`❌ ${contractName} deployment failed!`);
      return;
    }

    console.log(`🚀 ${contractName} deployed!`);
  }
};


export default deployTokens;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployTokens.tags = ["tokens"];
