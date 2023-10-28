// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// using openzeppelin-contract v4.8.3
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WBTC is ERC20, Ownable {
    constructor()
        ERC20("Wrapped Ether", "WETH")
        Ownable()
    {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
