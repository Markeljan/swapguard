
![SwapGuard](/scaffold-eth/packages/nextjs/public/readme/swapguard.svg)
# Price-Protected Trading on Flare Network - inspired by EIP-7265

[Video Demo](https://www.youtube.com/watch?v=CiVqfb8Ow7U)

[NEAR BOS Frontend](https://near.org/near/widget/ComponentDetailsPage?src=markeljan.near/widget/SwapGuard)

## What is SwapGuard
**SwapGuard** is a Smart Contract Module aimed at improving the UX and security of trading on DEXes, especially in terms of ensuring fair prices and preventing adverse trade conditions.

To demonstrate SwapGuard's functionality, we have built the:
### First Price-Protected DEX on the Flare Network
**Offering a price guarantee on all trades, powered by native price feeds on Flare Network.**

## Eliminating Price Manipulations
- **Slippage** -> _swap-guarded_
- **Front Running** -> _swap-guarded_
- **Low Liquidity** -> _swap-guarded_
- **Oracle Manipulation** -> _swap-guarded_

## How it Works
![Diagram](/scaffold-eth/packages/nextjs/public/readme/diagram.svg)

Users send transactions via a decentralized frontend built with NEAR BOS. The system checks prices between the oracle and the liquidity pool. If the price is good, the transaction is executed; otherwise, it's rejected.

# NEAR BOS Component
<img width="800" alt="image" src="https://github.com/Markeljan/swapguard/assets/12901349/fdd9a2b5-9099-4bcb-a745-005ad7659ff6">


## Credits to Flare Network
Before Flare Network's FTSO, gas-efficient circuit breakers were challenging. In relation to our work on EIP-7265 and implementations on other networks, circuit breakers usually had significant gas implications. Flare's native on-chain price feeds resolve this issue, making circuit breakers a prominent use case that highlights the USPs of Flare.


sponsored tech stacK:

![DEX Image](/scaffold-eth/packages/nextjs/public/readme/sponsors.svg)
