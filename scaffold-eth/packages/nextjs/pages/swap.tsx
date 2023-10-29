import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { MetaHeader } from "~~/components/MetaHeader";
import { useDeployedContractInfo, useNetworkColor, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getContractNames } from "~~/utils/scaffold-eth/contractNames";
import Image from "next/image";

const selectedContractStorageKey = "scaffoldEth2.selectedContract";
const contractNames = getContractNames();


const Swap: NextPage = () => {
  const tokenNames = ["WETH", "USDC"];
  const [selectedToken, setSelectedToken] = useState<string>(tokenNames[0]);
  const [tokenAmount, setTokenAmount] = useState<string>("0");
  const { data: usdcData } = useDeployedContractInfo("USDC");
  const usdcAddress = usdcData?.address;
  const { data: wethData } = useDeployedContractInfo("WETH");
  const wethAddress = wethData?.address;

  const scaffoldRead = useScaffoldContractRead({
    contractName: "MultiDEX",
    functionName: "calculateTokenAmount",
    args: [usdcAddress, wethAddress, tokenAmount],
  });

  console.log("scaffoldRead", scaffoldRead.data);

  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
  );

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
      <div className="bg-gray-900 text-white text-center py-">
      <div className="flex relative w-100 h-48">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/flaredex.svg" />
          </div>
      </div>

      
      <div className="bg-gray-900 h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-xl w-96">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-medium text-white">Swap</p>
            <p className="text-xl font-medium text-white">Buy</p>
            <button className="bg-gray-700 p-1 rounded-full hover:bg-gray-600">
              <img src="/path-to-settings-icon.svg" alt="Settings" />
            </button>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <p className="text-white text-lg">You pay</p>
              <div className="flex items-center space-x-2">
                <input type="text" className="bg-gray-800 rounded-md text-white px-2 py-1 w-20" placeholder="0" />
                <select
                  className="bg-gray-800 rounded-md text-white px-2 py-1"
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                >
                  {tokenNames.map((token, index) => (
                    <option key={index} value={token}>
                      {token}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <p className="text-white text-lg">You receive</p>
              <div className="flex items-center space-x-2">
                <input type="text" className="bg-gray-800 rounded-md text-white px-2 py-1 w-20" placeholder="0" />
                {/* For now only added WETH, you can extend this as needed */}
                <select className="bg-gray-800 rounded-md text-white px-2 py-1">
                  <option>USDC</option>
                </select>
              </div>
            </div>
          </div>
          <button className="bg-purple-600 mt-4 py-2 w-full rounded-md text-white">
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


