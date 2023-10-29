_price-protected trading on flare network, inspired by EIP-7265_
Offering a price guarantee on all trades, powered by native price feeds on Flare Network.

__SwapGuard__ is a Smart Contract Module aimed at improving the UX and security of trading on DEXes,
especially in terms of ensuring fair prices and preventing adverse trade conditions.
![Alt text](/scaffold-eth/packages/nextjs/public/readme/swapguard.svg)
To demonstrate SwapGuards functionality, we have build the
**first price-protected DEX on the Flare Network.**
offering a price guarantee on all trades, powered by native price feeds on Flare Network.

![Alt text](/scaffold-eth/packages/nextjs/public/readme/sponsors.svg)

**Eliminating Price Manipulations:**
__Slippage__ -> _swap-guarded_
__Front Running__ -> _swap-guarded_
__Low Liquidity__ -> _swap-guarded_
__Oracle Manipulation__ -> _swap-guarded_

**How it works**

![Alt text](/scaffold-eth/packages/nextjs/public/readme/diagram.svg)
Users send transactions via a decentralized frontend built with NEAR BOS.
The system checks prices between the oracle and the liquidity pool.
If the price is good, the transaction is executed; otherwise, it's rejected.


Credits to Flare Network:
Before flare networks FTSO makes gas efficient circuit breakers possible. In regards to our work on EIP-7265 and implementations on other networks, circuit breakers tended to have huge implications on gas. Flares native on-chain price feeds, eliminate this Issue and found with circuit breakers a great use case embracing the USPs of flare.