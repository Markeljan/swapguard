const main = async function () {
  const hre = require("hardhat");

  const { deployer, frontRunAcc } = await hre.getNamedAccounts();
  const wethContract = await hre.ethers.getContract("WETH");
  const usdcContract = await hre.ethers.getContract("USDC");
  const dexContract = await hre.ethers.getContract("MultiDEX");
  const frontRunnerContract = await hre.ethers.getContract("FrontRunner");

  // Mint tokens
  const wethMintAmount = hre.ethers.utils.parseEther('1000');
  const usdcMintAmount = hre.ethers.utils.parseEther('1775000');

  // Mint tokens for deployer
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
    console.log("Tokens already added to MultiDEX, Skipping...");
  }
  try {
    // Add liquidity to MultiDEX
    await dexContract.addLiquidity(usdcContract.address, wethContract.address, usdcMintAmount, wethMintAmount);
    console.log("💦 Added liquidity to WETH-USDC pair");
  } catch (e) {
    console.log("Liquidity already added to WETH-USDC pair, Skipping...");
  }



  // Mint tokens for frontRunner
  await wethContract.mint(frontRunAcc, wethMintAmount.mul(10));
  console.log("🪙 Minted WETH tokens for FrontRunner");
  await usdcContract.mint(frontRunAcc, usdcMintAmount.mul(10));
  console.log("🪙 Minted USDC tokens for FrontRunner");

  
  // Approve tokens from FrontRunner Acc to FrontRunnerContract
  const frontRunAccSigner = await hre.ethers.getSigner(frontRunAcc);

  const wethApprovalTx = await wethContract.connect(frontRunAccSigner).approve(frontRunnerContract.address, hre.ethers.constants.MaxUint256);
  await wethApprovalTx.wait();
  console.log("✅ new allowance for WETH tokens: ", await wethContract.allowance(frontRunAcc, frontRunnerContract.address));

  const usdcApprovalTx = await usdcContract.connect(frontRunAccSigner).approve(frontRunnerContract.address, hre.ethers.constants.MaxUint256);
  await usdcApprovalTx.wait();
  console.log("✅ new allowance for USDC tokens: ", await usdcContract.allowance(frontRunAcc, frontRunnerContract.address));



};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
