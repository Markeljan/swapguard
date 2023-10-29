import { useMemo, useState } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { formatUnits, parseUnits } from "viem";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { USDCIcon, WETHIcon } from "~~/components/assets/Icons";

const Swap: NextPage = () => {
  const tokenNames = ["WETH", "USDC"];
  const [inputToken, setInputToken] = useState<string>(tokenNames[0]);
  const [outputToken, setOutputToken] = useState<string>(tokenNames[1]);
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
    return formatUnits(calculateTokenAmount.data.toString(), 18);
  }
    , [calculateTokenAmount.data]);

  const swapTokens = useScaffoldContractWrite({
    contractName: "MultiDEX",
    functionName: "swapTokenToToken",
    args: [inputAddress, outputAddress, formattedInputAmount],
  });





  console.log("scaffoldRead", calculateTokenAmount.data);

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
            <div className="mb-4">
              <p className="text-xl font-medium text-white">Swap</p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                <p className="text-white text-lg">You pay</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={0}
                    className="input input-bordered w-20"
                    placeholder="0"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                  />
                  <div className="flex btn btn-ghost">
                    {inputToken === "WETH" ? (
                      <WETHIcon className="w-4" />) : (
                      <USDCIcon className="w-6" />)
                    } {inputToken}
                  </div>
                </div>
              </div>
              <button
                onClick={handleTokenToggle}
                className="btn btn-circle btn-ghost mx-auto p-2"
              >
                <ArrowsUpDownIcon />
              </button>
              <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                <p className="text-white text-lg">You receive</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="input input-bordered w-20"
                    placeholder="0"
                    disabled
                    value={displayTokenAmount}
                  />

                  <div className="flex btn btn-ghost">
                    {outputToken === "WETH" ? (
                      <WETHIcon className="w-4" />) : (
                      <USDCIcon className="w-6" />)
                    } {outputToken}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary mt-4 w-full"
              onClick={() => swapTokens.writeAsync()}
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
