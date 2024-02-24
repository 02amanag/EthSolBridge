# Solana-Ethereum Bridge

This project implements a bridge between Ethereum (Sepolia) and Solana (Devnet) blockchains. The bridge allows for the transfer of tokens between the two networks.

## Contracts

### BridgeBase.sol

This contract serves as the base contract for the bridge implementation. It provides basic functionalities and interfaces for interacting with the bridge.

### BridgeEth.sol

This contract implements the bridge on the Ethereum (Sepolia) blockchain. It handles the transfer of tokens from Ethereum to Solana.

### IToken.sol

This interface defines the methods required for interacting with tokens.

### TokenBase.sol

This contract serves as the base contract for token implementations. It provides basic functionalities and interfaces for interacting with tokens.

### TokenEth.sol

This contract implements the token on the Ethereum (Sepolia) blockchain. It provides the token functionality required for the bridge.

## Scripts

### bridge.js

This script contains the logic for interacting with the bridge. It facilitates the transfer of tokens between Ethereum and Solana blockchains.

### solanaTokenMint.js

This script contains the logic for minting tokens on the Solana (Devnet) blockchain. It is used in conjunction with the bridge to mint tokens received from Ethereum.

## Installation

To install the required dependencies, run:

```bash
npm install
```

## Deployment

Run ```node script/bridge.js``` before any tranaction. So the Event can start listening the transaction and take necessary action when required.

### Ethereum

we are using Sepolia testnet for Ethereum connection. I used remix IDE for development and deployment.
Deployment process goes with following cronology

#### Deploy 
    - TokenEth
        - Mint some token to Address
    - BridgeEth (Use TokenEth address at deployment constructor)
        - Update admin in TokenEth as BridgeEth's address

#### Configuration 
    - TokenEth Address - TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
    - BridgeEth Address - 6d7j8E4RuXZsy4tNFzmZ8QV7rf6Pn575iHLyMX7VdeZ2


### Solana

we are using devnet for Solana connection. I used solana-cli for development and deployment of spl token.
With configured account as admin. Using following information we setup solanaTokenMint.js script for minting token to respective address.

#### Configuration 
    - Token Program ID - TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
    - Token Mint Address - 6d7j8E4RuXZsy4tNFzmZ8QV7rf6Pn575iHLyMX7VdeZ2

As spl token is configured with 9 decimal places, we will be multiplying amount with `1000000000` to mint equal token.

## Note and References
- All the transaction is visible on Solana Explorer and Etherscan for Solana devtnet and Ethereum(Sepolia) respectively.
- I used Remix Ide for sending the token hazelfree.
- [Remix IDE](https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.24+commit.e11b9ed9.js)
- [Solana Explorer](https://explorer.solana.com/?cluster=devnet)
