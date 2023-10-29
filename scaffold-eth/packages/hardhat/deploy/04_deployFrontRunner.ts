import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFrontRunner: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { frontRunAcc } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;
    const wethContract = await hre.ethers.getContract("WETH");
    const usdcContract = await hre.ethers.getContract("USDC");
    const dexContract = await hre.ethers.getContract("MultiDEX");

    const deployTx = await deploy("FrontRunner", {
        from: frontRunAcc,
        args: [
            // Address of MultiDEX contract
            dexContract.address,
            // Address of token A
            wethContract.address,
            // Address of token B
            usdcContract.address,
        ],
        log: true,
        autoMine: true,
    });
    const deployReceipt = await deployTx.receipt;
    const frontRunnerContractAddress = deployReceipt?.contractAddress

    if (deployReceipt?.status !== 1 || !frontRunnerContractAddress) {
        console.log("❌ FrontRunner deployment failed!");
        return;
    }

    console.log("🚀 FrontRunner deployed!");
};

export default deployFrontRunner;

deployFrontRunner.tags = ["frontRunner"];
