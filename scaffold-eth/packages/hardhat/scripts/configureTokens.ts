const main = async function () {
  const hre = require("hardhat");

  const { deployer } = await hre.getNamedAccounts();
  const wethContract = await hre.ethers.getContract("WETH");
  const usdcContract = await hre.ethers.getContract("USDC");
  const dexContract = await hre.ethers.getContract("MultiDEX");

  // Mint tokens
  const wethMintAmount = hre.ethers.utils.parseEther('100000');
  const usdcMintAmount = hre.ethers.utils.parseEther('177500000');

  // Mint tokens
  await wethContract.mint(deployer, wethMintAmount);
  console.log("🪙 Minted WETH tokens");
  await usdcContract.mint(deployer, usdcMintAmount);
  console.log("🪙 Minted USDC tokens");

  // Approve MultiDEX to use tokens
  await wethContract.approve(dexContract.address, hre.ethers.constants.MaxUint256);
  console.log("✅ Approved WETH tokens");
  await usdcContract.approve(dexContract.address, hre.ethers.constants.MaxUint256);
  console.log("✅ Approved USDC tokens for WETH pair");

  // Add the tokens to MultiDEX
  try {
    await dexContract.addSupportedToken(usdcContract.address);
    console.log("📊 Added WETH as supported token");
    const tx = await dexContract.addSupportedToken(wethContract.address);
    console.log("📊 Added USDC as supported token");
    await tx.wait()
  } catch (e) {
    console.log(e);
  }
  try {
    // Add liquidity to MultiDEX
    await dexContract.addLiquidity(usdcContract.address, wethContract.address, usdcMintAmount, wethMintAmount);
    console.log("💦 Added liquidity to WETH-USDC pair");
  } catch (e) {
    console.log(e);
  }
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
