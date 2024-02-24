const Web3 = require("web3");
const { solanaTransaction } = require("./solanaTokenMint");
const bridgeEthAbi = require("../contracts/artifacts/bridgeEthAbi.json");

// bridge contract abi
const BridgeEthAbi = bridgeEthAbi.abi;

// Eth bridge contract address
const EthBridge = "0xa248de409fce7912bE2ecDDf0cEd1661Dc504743";
// Contract owner address
const admin = "0xF509e1E71BF94dB57F0dC3aC9A7b5fAB402C95eA";

const web3Eth = new Web3("wss://ethereum-sepolia.publicnode.com");
const bridgeEth = new web3Eth.eth.Contract(BridgeEthAbi, EthBridge);

console.log("Admin", admin);

main = async () => {
  //fetch latest block number of sepolia
  const latestBlockNumber = await web3Eth.eth.getBlockNumber();
  console.log("latest block number ", latestBlockNumber);

  bridgeEth.events //running event from latest block
    .Send({ fromBlock: latestBlockNumber, step: 0 })
    .on("data", async (event) => {
      const { from, to, amount, date, chain } = event.returnValues;

      // verify for transfering chain
      if (chain.toString() == "solana") {
        // make a transaction using above data
        const transactionHash = await solanaTransaction(amount, to);

        if (transactionHash) {
          console.log(`Transfer transaction hash: ${transactionHash}`);
        } else {
          console.log("transaction failed.... reversing token");

          // transaction failed, reversing token to account
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

// refund token
const reverceFund = async (to, amount) => {
  const nonce = await fetchNounce(); // bridge transacation nounce

  // transaction
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
  const receipt = await web3Eth.eth.sendTransaction(txData);
  console.log(`Refund transaction hash: ${receipt.transactionHash}`);
};

// fetch transaction nonce
const fetchNounce = async () => {
  return await bridgeEth.functions.nonce.call();
};
