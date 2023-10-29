import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { formatUnits, parseUnits } from "viem";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { USDCIcon, WETHIcon } from "~~/components/assets/Icons";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { privateKeyToAccount } from "viem/accounts";

const Swap: NextPage = () => {
  const tokenNames = ["WETH", "USDC"];
  const [inputToken, setInputToken] = useState<string>(tokenNames[0]);
  const [outputToken, setOutputToken] = useState<string>(tokenNames[1]);
  const [swapGuardEnabled, setSwapGuardEnabled] = useState<boolean>(false);
  const [inputAmount, setInputAmount] = useState<string>("0");
  const { data: usdcData } = useDeployedContractInfo("USDC");
  const usdcAddress = usdcData?.address;
  const { data: wethData } = useDeployedContractInfo("WETH");
  const wethAddress = wethData?.address;

  const inputAddress = inputToken === "WETH" ? wethAddress : usdcAddress;
  const outputAddress = outputToken === "WETH" ? wethAddress : usdcAddress;

  const formattedInputAmount = parseUnits(inputAmount, 18).toString();


  const calculateTokenAmount = useScaffoldContractRead({
    contractName: "MultiDEX",
    functionName: "calculateTokenAmount",
    args: [inputAddress, outputAddress, formattedInputAmount],
  });

  const displayTokenAmount = useMemo(() => {
    if (!calculateTokenAmount.data) return "";
    const tokenAmount = formatUnits(calculateTokenAmount.data, 18);
    return (parseFloat(tokenAmount).toFixed(2)).toString();
  }, [calculateTokenAmount.data]);

  const { data: tokenPriceData } = useScaffoldContractRead({
    contractName: "MultiDEX",
    functionName: "getTokenPriceWei",
    args: ["testETH"],
    watch: true,
  });

  const { tokenPrice, inputValueUSD, outputValueUSD } = useMemo(() => {
    const tokenPrice = tokenPriceData
      ? Number(formatUnits(tokenPriceData[0], 5)).toFixed(2)
      : "0";
    const inputTokenPrice = inputToken === "USDC" ? 1 : Number(tokenPrice);
    const outputTokenPrice = outputToken === "USDC" ? 1 : Number(tokenPrice);
    const inputValueUSD = '$ ' + (inputTokenPrice * Number(inputAmount)).toFixed(2);
    const outputValueUSD = '$ ' + (outputTokenPrice * Number(displayTokenAmount)).toFixed(2);
    return { tokenPrice, inputValueUSD, outputValueUSD };
  }, [tokenPriceData, inputAmount, displayTokenAmount, inputToken, outputToken]);
  const [stopFrontRun, setStopFrontRun] = useState<boolean>(false);

  const estimatedPrice = swapGuardEnabled === false ? BigInt(0) : BigInt(Number(tokenPrice).toFixed(0));

  const swapTokens = useScaffoldContractWrite({
    contractName: "MultiDEX",
    functionName: "swapTokenToToken",
    args: [inputAddress, outputAddress, formattedInputAmount, estimatedPrice],
  });


  const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_FRONTRUNNER_PK}`)

  // call contract
  const manipulatePrice = useScaffoldContractWrite({
    contractName: "FrontRunner",
    functionName: "manipulatePrice",
    args: [500000000000000000000],
    account,
  });

  const completeFrontRun = useScaffoldContractWrite({
    contractName: "FrontRunner",
    functionName: "completeFrontRun",
    args: [],
    account,
  });

  useEffect(() => {
    if (!stopFrontRun && manipulatePrice.isSuccess && (swapTokens.isSuccess || swapTokens.isMining)) {
      console.log('Sending Complete Front Run Transaction')
      completeFrontRun.writeAsync()
      setStopFrontRun(true)
    }
  }, [manipulatePrice.isSuccess, swapTokens.isSuccess, swapTokens.isMining, stopFrontRun, completeFrontRun])


  const handleTokenToggle = () => {
    setInputToken((prevToken) => (prevToken === "WETH" ? "USDC" : "WETH"));
    setOutputToken((prevToken) => (prevToken === "WETH" ? "USDC" : "WETH"));
  };

  return (
    <>
      <MetaHeader title="FlareSwap" description="FlareSwap using scaffold-eth" />
      <div className="bg-gray-900 min-h-screen flex flex-col w-full mx-auto">
        <div className="flex flex-col justify-center items-center">
          <div className="flex relative w-100 h-48 w-48 ">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/flaredex.svg" />
          </div>
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <div className="flex items-center justify-end gap-4">
              <p className="text-white text-lg">Enable SwapGuard</p>
              <input
                type="checkbox"
                className="checkbox checkbox-secondary color-secondary-500"
                checked={swapGuardEnabled}
                onChange={(e) => setSwapGuardEnabled(e.target.checked)}
              />
              <div className="tooltip tooltip-bottom" data-tip="SwapGuard is a feature that allows you to swap tokens without the risk of high slippage by using Flare's FTSO on-chain oracles.">
                <InformationCircleIcon className="w-4" />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between bg-gray-700 pb-8 px-4 rounded-lg">
                <div className="flex flex-col">
                  <div className="flex flex gap-1">
                    <p className="text-gray-500 text-md">Pay:</p>
                    <p className="text-white text-md">{inputValueUSD}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={0}
                      className="input input-bordered w-full"
                      placeholder="0"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                    />
                    <div className="flex gap-2">
                      {inputToken === "WETH" ? (
                        <WETHIcon className="w-4" />) : (
                        <USDCIcon className="w-6" />)
                      } {inputToken}
                    </div>

                  </div>
                </div>
              </div>
              <button
                onClick={handleTokenToggle}
                className="btn btn-circle btn-ghost mx-auto"
              >
                <ArrowsUpDownIcon className="p-2" />
              </button>
              <div className="flex items-center justify-between bg-gray-700 pb-8 px-4 rounded-lg">
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    <p className="text-gray-500 text-md">Receive:</p>
                    <p className="text-white text-md">{outputValueUSD}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={0}
                      className="input input-bordered w-full"
                      placeholder="0"
                      disabled
                      value={displayTokenAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                    />
                    <div className="flex gap-2">
                      {outputToken === "WETH" ? (
                        <WETHIcon className="w-4" />) : (
                        <USDCIcon className="w-6" />)
                      } {outputToken}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary mt-6 w-full"
              onClick={() => {
                manipulatePrice.writeAsync();
                swapTokens.writeAsync()
              }
              }
            >
              Swap
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Swap Tokens</h1>
        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / pages / swap.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default Swap;
