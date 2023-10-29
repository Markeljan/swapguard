import { useMemo, useState } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { formatUnits, parseUnits } from "viem";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";

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

  console.log("scaffoldRead", scaffoldRead.data);

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract]);
  return (
    <>
      <MetaHeader
        title="FlareSwap"
        description="FlareSwap using scaffold-eth"
      />
      <div className="bg-gray-900 text-white text-center py-4">
        Swap Interface | Your DEX Name
      </div>

      
      <div className="bg-gray-900 h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-xl w-96">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-medium text-white">Swap</p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <p className="text-white text-lg">You pay</p>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  className="bg-gray-800 rounded-md text-white px-2 py-1 w-20"
                  placeholder="0"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                />
                <span className="bg-gray-800 rounded-md text-white px-2 py-1">
                  {inputToken}
                </span>
              </div>
            </div>
            <button
              onClick={handleTokenToggle}
              className="w-12 mx-auto bg-gray-700 p-2 rounded-full"
            >
              <ArrowsUpDownIcon />
            </button>
            <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <p className="text-white text-lg">You receive</p>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  className="bg-gray-800 rounded-md text-white px-2 py-1 w-20"
                  placeholder="0"
                  disabled
                  value={displayTokenAmount}
                />
                <span className="bg-gray-800 rounded-md text-white px-2 py-1">
                  {outputToken}
                </span>
              </div>
            </div>
          </div>
          <button className="bg-purple-600 mt-4 py-2 w-full rounded-md text-white"
            onClick={() => swapTokens.writeAsync()}
          >
            Swap
          </button>
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
