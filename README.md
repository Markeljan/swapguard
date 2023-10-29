# Price-Protected Trading on Flare Network, Inspired by EIP-7265

Offering a price guarantee on all trades, powered by native price feeds on Flare Network.

## SwapGuard
**SwapGuard** is a Smart Contract Module aimed at improving the UX and security of trading on DEXes, especially in terms of ensuring fair prices and preventing adverse trade conditions.

![SwapGuard](/scaffold-eth/packages/nextjs/public/readme/swapguard.svg)

To demonstrate SwapGuard's functionality, we have built the:
### First Price-Protected DEX on the Flare Network
Offering a price guarantee on all trades, powered by native price feeds on Flare Network.

![DEX Image](/scaffold-eth/packages/nextjs/public/readme/sponsors.svg)

## Eliminating Price Manipulations
- **Slippage** -> _swap-guarded_
- **Front Running** -> _swap-guarded_
- **Low Liquidity** -> _swap-guarded_
- **Oracle Manipulation** -> _swap-guarded_

## How it Works
![Diagram](/scaffold-eth/packages/nextjs/public/readme/diagram.svg)
Users send transactions via a decentralized frontend built with NEAR BOS. The system checks prices between the oracle and the liquidity pool. If the price is good, the transaction is executed; otherwise, it's rejected.

## Credits to Flare Network
Before Flare Network's FTSO, gas-efficient circuit breakers were challenging. In relation to our work on EIP-7265 and implementations on other networks, circuit breakers usually had significant gas implications. Flare's native on-chain price feeds resolve this issue, making circuit breakers a prominent use case that highlights the USPs of Flare.
