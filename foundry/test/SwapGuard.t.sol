// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Test, console2} from "forge-std/Test.sol";
import {SwapGuard} from "../src/SwapGuard.sol";

contract SwapGuardTest is Test {
    SwapGuard public swapGuard;

    function setUp() public {
        swapGuard = new SwapGuard();
    }

    function test_GetTokenPriceWei() view public {
        (uint256 price, uint256 timestamp, uint256 decimals) = swapGuard
            .getTokenPriceWei("ETH");
        console2.logUint(price);
        console2.logUint(timestamp);
        console2.logUint(decimals);
    }
}
