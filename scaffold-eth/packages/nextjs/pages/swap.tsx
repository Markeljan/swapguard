import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Swap: NextPage = () => {
  const tokenNames = ["ETH", "WBTC"];
  const [selectedToken, setSelectedToken] = useState<string>(tokenNames[0]);

  useEffect(() => {
    if (!tokenNames.includes(selectedToken)) {
      setSelectedToken(tokenNames[0]);
    }
  }, [selectedToken, setSelectedToken]);

  return (
    <>
      <MetaHeader
        title="FlareSwap"
        description="FlareSwap using scaffold-eth"
      />
     <div className="bg-gray-900 text-white text-center py-4">
        Swap Interface | Your DEX Name
      </div>
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
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
                {/* For now only added WBTC, you can extend this as needed */}
                <select className="bg-gray-800 rounded-md text-white px-2 py-1">
                  <option>WBTC</option>
                </select>
              </div>
            </div>
          </div>
          <button className="bg-purple-600 mt-4 py-2 w-full rounded-md text-white">
            Connect wallet
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
