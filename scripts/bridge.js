const Web3 = require("web3");
const { solanaTransaction } = require("./solanaTokenMint");
const BridgeEthAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "enum BridgeBase.Step",
        name: "step",
        type: "uint8",
      },
    ],
    name: "Receive",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "to",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "chain",
        type: "string",
      },
      {
        indexed: true,
        internalType: "enum BridgeBase.Step",
        name: "step",
        type: "uint8",
      },
    ],
    name: "Send",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "otherChainNonce",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "processedNonces",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "to",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "chain",
        type: "string",
      },
    ],
    name: "send",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const EthBridge = "0xa248de409fce7912bE2ecDDf0cEd1661Dc504743";

const web3Eth = new Web3("wss://ethereum-sepolia.publicnode.com");

const bridgeEth = new web3Eth.eth.Contract(BridgeEthAbi, EthBridge);

const admin = "0xF509e1E71BF94dB57F0dC3aC9A7b5fAB402C95eA";

console.log("Admin", admin);

main = async () => {
  const latestBlockNumber = await web3Eth.eth.getBlockNumber();
  console.log("latest block number ", latestBlockNumber);

  bridgeEth.events
    .Send({ fromBlock: latestBlockNumber, step: 0 })
    .on("data", async (event) => {
      const { from, to, amount, date, chain } = event.returnValues;

      // make a transaction using above data
      if (chain.toString() == "solana") {
        const transactionHash = await solanaTransaction(amount, to);

        if (transactionHash) {
          console.log(`Transaction hash: ${transactionHash}`);
        } else {
          console.log("transaction failed.... reversing funds");
          return reverceFund(from, amount);
        }

        console.log(`
      Processed transfer:
      - from ${from}
      - to ${to}
      - amount ${amount} tokens
      - chain ${chain}
    `);
      } else {
        console.log("Bridge is not setup for - ", chain.toString());
      }
    })
    .on("connected", () => {
      console.log("Connected Sepolia");
    })
    .on("error", (error) => {
      console.log("Error from Sepolia - ", error);
    });
};
main();

const reverceFund = async (to, amount) => {
  const nonce = await fetchNounce();

  const tx = bridgeEth.methods.mint(to, amount, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3Eth.eth.getGasPrice(),
    tx.estimateGas({ from: admin }),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeEth.options.address,
    data,
    gas: gasCost,
    gasPrice,
  };
  console.log("transaction data -->", txData);
  const receipt = await web3Eth.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
};

const fetchNounce = async () => {
  return await bridgeEth.functions.nonce.call();
};
