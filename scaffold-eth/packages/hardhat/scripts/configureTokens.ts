const main = async function () {
  const hre = require("hardhat");

  const { deployer } = await hre.getNamedAccounts();
  const wflrContract = await hre.ethers.getContract("WFLR");
  const wethContract = await hre.ethers.getContract("WETH");
  const dexContract = await hre.ethers.getContract("MultiDEX");

  // Mint tokens
  const wflrMintAmount = hre.ethers.utils.parseEther("1000000000");
  const tokenMintAmount = hre.ethers.utils.parseEther("6000");

  await wflrContract.mint(deployer, wflrMintAmount);
  await wethContract.mint(deployer, tokenMintAmount);

  // Approve MultiDEX to tokens
  await wflrContract.approve(dexContract.address, wflrMintAmount);
  await wethContract.approve(dexContract.address, tokenMintAmount);

  // Add the tokens to MultiDEX
  const addWFLRTx = await dexContract.addSupportedToken(wflrContract.address);
  await addWFLRTx.wait(); // Wait for the transaction to be mined

  const addWETHTx = await dexContract.addSupportedToken(wethContract.address);
  await addWETHTx.wait(); // Wait for the transaction to be mined

  // Add liquidity to MultiDEX
  await dexContract.addLiquidity(wflrContract.address, wethContract.address, wflrMintAmount, tokenMintAmount);

  console.log("🚀 Tokens configured!");
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
