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
