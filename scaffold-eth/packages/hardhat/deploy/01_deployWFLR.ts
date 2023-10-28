import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";


const contractName = "WFLR";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;



  await deploy(contractName, {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract
  const tokenContract = await hre.ethers.getContract(contractName, deployer);
  const dexContract = await hre.ethers.getContract("MultiDEX", deployer);

  // Mint 100,000 tokens
  const mintAmount = hre.ethers.utils.parseUnits("100000", 18);
  await tokenContract.mint(deployer, mintAmount);

  // Approve MultiDEX to spend all tokens
  await tokenContract.approve(dexContract.address, mintAmount);

};

export default deployContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployContract.tags = [contractName];
