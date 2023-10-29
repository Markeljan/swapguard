// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MultiDEX
 * @dev A multi-token decentralized exchange (DEX) contract.
 */
contract MultiDEXold is Ownable {
	struct TokenInfo {
		address token;
		uint256 liquidity;
	}

	mapping(address => TokenInfo) public tokenInfoMap;
	address[] public supportedTokens;

	constructor() Ownable() {}

	function addSupportedToken(address _token) public onlyOwner {
		require(
			tokenInfoMap[_token].token == address(0),
			"Token already supported"
		);
		supportedTokens.push(_token);
		tokenInfoMap[_token] = TokenInfo(_token, 0);
	}

	function getTokensInContract(address _token) public view returns (uint256) {
		return IERC20(_token).balanceOf(address(this));
	}

	function addLiquidity(
		address _tokenA,
		address _tokenB,
		uint256 _amountA,
		uint256 _amountB
	) public {
		require(
			tokenInfoMap[_tokenA].token != address(0) &&
				tokenInfoMap[_tokenB].token != address(0),
			"Tokens not supported"
		);

		TokenInfo storage tokenInfoA = tokenInfoMap[_tokenA];
		TokenInfo storage tokenInfoB = tokenInfoMap[_tokenB];

		uint256 liquidityA;
		uint256 liquidityB;
		uint256 reserveA = getTokensInContract(_tokenA);
		uint256 reserveB = getTokensInContract(_tokenB);
		IERC20 tokenA = IERC20(_tokenA);
		IERC20 tokenB = IERC20(_tokenB);

		if (reserveA == 0 || reserveB == 0) {
			tokenA.transferFrom(msg.sender, address(this), _amountA);
			tokenB.transferFrom(msg.sender, address(this), _amountB);
			liquidityA = _amountA;
			liquidityB = _amountB;
		} else {
			require(
				_amountA >= (_amountB * reserveA) / reserveB &&
					_amountB >= (_amountA * reserveB) / reserveA,
				"Amount of tokens sent is less than the minimum tokens required"
			);
			tokenA.transferFrom(msg.sender, address(this), _amountA);
			tokenB.transferFrom(msg.sender, address(this), _amountB);
			unchecked {
				liquidityA = (tokenInfoA.liquidity * _amountA) / reserveA;
				liquidityB = (tokenInfoB.liquidity * _amountB) / reserveB;
			}
		}

		tokenInfoA.liquidity += liquidityA;
		tokenInfoB.liquidity += liquidityB;
	}

	function removeLiquidity(
		address _tokenA,
		address _tokenB,
		uint256 _liquidity
	) public {
		require(_liquidity > 0, "Liquidity should be greater than zero");
		require(
			tokenInfoMap[_tokenA].token != address(0) &&
				tokenInfoMap[_tokenB].token != address(0),
			"Tokens not supported"
		);

		TokenInfo storage tokenInfoA = tokenInfoMap[_tokenA];
		TokenInfo storage tokenInfoB = tokenInfoMap[_tokenB];

		uint256 totalLiquidityA = tokenInfoA.liquidity;
		uint256 totalLiquidityB = tokenInfoB.liquidity;
		uint256 tokenAmountA = (getTokensInContract(_tokenA) * _liquidity) /
			totalLiquidityA;
		uint256 tokenAmountB = (getTokensInContract(_tokenB) * _liquidity) /
			totalLiquidityB;

		tokenInfoA.liquidity -= _liquidity;
		tokenInfoB.liquidity -= _liquidity;

		IERC20(_tokenA).transfer(msg.sender, tokenAmountA);
		IERC20(_tokenB).transfer(msg.sender, tokenAmountB);
	}

	function getAmountOfTokens(
		uint256 inputAmount,
		uint256 inputReserve,
		uint256 outputReserve
	) public pure returns (uint256) {
		require(inputReserve > 0 && outputReserve > 0, "Invalid Reserves");
		uint256 numerator = inputAmount * outputReserve;
		uint256 denominator = inputReserve + inputAmount;
		return numerator / denominator;
	}

	function calculateTokenAmount(
		address tokenIn,
		address tokenOut,
		uint256 tokensSold
	) public view returns (uint256) {
		require(
			tokenInfoMap[tokenIn].token != address(0) &&
				tokenInfoMap[tokenOut].token != address(0),
			"Tokens not supported"
		);

		uint256 reservedTokensIn = getTokensInContract(tokenIn);
		uint256 reservedTokensOut = getTokensInContract(tokenOut);

		uint256 tokensBought = getAmountOfTokens(
			tokensSold,
			reservedTokensIn,
			reservedTokensOut
		);

		return tokensBought;
	}

	function swapTokenToToken(
		address _tokenIn,
		address _tokenOut,
		uint256 _tokensSold
	) public {
		require(
			tokenInfoMap[_tokenIn].token != address(0) &&
				tokenInfoMap[_tokenOut].token != address(0),
			"Tokens not supported"
		);

		uint256 _reservedTokensIn = getTokensInContract(_tokenIn);
		uint256 _reservedTokensOut = getTokensInContract(_tokenOut);
		uint256 _tokensBought = getAmountOfTokens(
			_tokensSold,
			_reservedTokensIn,
			_reservedTokensOut
		);
		IERC20(_tokenIn).transferFrom(msg.sender, address(this), _tokensSold);
		IERC20(_tokenOut).transfer(msg.sender, _tokensBought);
	}
}
