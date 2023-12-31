// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// using openzeppelin-contract v4.8.3
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WETH is ERC20, Ownable {
    constructor()
        ERC20("Wrapped Ether", "WETH")
        Ownable()
    {

    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
}
