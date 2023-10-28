// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MultiDEX {
    struct TokenInfo {
        address token;
        uint256 liquidity;
    }
    
    mapping(address => TokenInfo) public tokenInfoMap;
    address[] public supportedTokens;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function addSupportedToken(address _token) public onlyOwner {
        require(tokenInfoMap[_token].token == address(0), "Token already supported");
        supportedTokens.push(_token);
        tokenInfoMap[_token] = TokenInfo(_token, 0);
    }
    
    function getTokensInContract(address _token) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }
    
    function addLiquidity(address _token, uint256 _amount) public payable returns (uint256) {
        require(tokenInfoMap[_token].token != address(0), "Token not supported");
        
        TokenInfo storage tokenInfo = tokenInfoMap[_token];
        
        uint256 _liquidity;
        uint256 balanceInEth = address(this).balance;
        uint256 tokenReserve = getTokensInContract(_token);
        IERC20 _tokenContract = IERC20(_token);
        
        if (tokenReserve == 0) {
            _tokenContract.transferFrom(msg.sender, address(this), _amount);
            _liquidity = balanceInEth;
        }
        else {
            uint256 reservedEth = balanceInEth - msg.value;
            require(
                _amount >= (msg.value * tokenReserve) / reservedEth,
                "Amount of tokens sent is less than the minimum tokens required"
            );
            _tokenContract.transferFrom(msg.sender, address(this), _amount);
            unchecked {
                _liquidity = (tokenInfo.liquidity * msg.value) / reservedEth;
            }
        }
        
        tokenInfo.liquidity += _liquidity;
        
        return _liquidity;
    }
    
    function removeLiquidity(address _token, uint256 _amount) public returns (uint256, uint256) {
        require(
            _amount > 0, "Amount should be greater than zero"
        );
        require(tokenInfoMap[_token].token != address(0), "Token not supported");
        
        TokenInfo storage tokenInfo = tokenInfoMap[_token];
        
        uint256 _reservedEth = address(this).balance;
        uint256 _totalLiquidity = tokenInfo.liquidity;

        uint256 _ethAmount = (_reservedEth * _amount) / _totalLiquidity;
        uint256 _tokenAmount = (getTokensInContract(_token) * _amount) / _totalLiquidity;
        
        tokenInfo.liquidity -= _amount;
        
        payable(msg.sender).transfer(_ethAmount);
        IERC20(_token).transfer(msg.sender ,_tokenAmount);
        
        return (_ethAmount, _tokenAmount);
    }
    
    function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    )
    public pure returns (uint256) 
    {
        require(inputReserve > 0 && outputReserve > 0, "Invalid Reserves");
        uint256 inputAmountWithFee = inputAmount;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        unchecked {
            return numerator / denominator;
        }
    }
    
    function swapEthTotoken(address _token) public payable {
        require(tokenInfoMap[_token].token != address(0), "Token not supported");
        
        uint256 _reservedTokens = getTokensInContract(_token);
        uint256 _tokensBought = getAmountOfTokens(
            msg.value, 
            address(this).balance, 
            _reservedTokens
        );
        IERC20(_token).transfer(msg.sender, _tokensBought);
    }
    
    function swapTokenToEth(address _token, uint256 _tokensSold) public {
        require(tokenInfoMap[_token].token != address(0), "Token not supported");
        
        uint256 _reservedTokens = getTokensInContract(_token);
        uint256 ethBought = getAmountOfTokens(
            _tokensSold,
            _reservedTokens,
            address(this).balance
        );
        IERC20(_token).transferFrom(
            msg.sender, 
            address(this), 
            _tokensSold
        );
        payable(msg.sender).transfer(ethBought);
    }
}
