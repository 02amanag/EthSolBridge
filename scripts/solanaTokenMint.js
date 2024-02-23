const { getOrCreateAssociatedTokenAccount } = require("@solana/spl-token");

const splToken = require("@solana/spl-token");
const web3 = require("@solana/web3.js");

const senderWallet = web3.Keypair.fromSecretKey(
  Uint8Array.from(SECRET_KEY_ARRAY) //replace with mint_address owner secret_key_array
);

const connection = new web3.Connection("https://api.devnet.solana.com");

const solanaTransaction = async (amount, receiverAddresss) => {
  const mint_address = "6d7j8E4RuXZsy4tNFzmZ8QV7rf6Pn575iHLyMX7VdeZ2";
  const tokenProgramId = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

  // recivers wallet address list
  const reciverAddresses = "CenakKgtM5Em6kLtbcJV75oQAHVLfBk7zsjbXNAytd2t";

  const receiverTokenAddress = await getOrCreateAssociatedTokenAccount(
    connection,
    senderWallet,
    new web3.PublicKey(mint_address),
    new web3.PublicKey(receiverAddresss)
  );
  console.log("Receiver token abalance ->", receiverTokenAddress.amount);
  console.log(
    "Receiver token address ->",
    receiverTokenAddress.address.toString()
  );

  console.log("sender Wallet ", senderWallet);

  console.log(
    "Sending",
    amount,
    "Token to",
    receiverTokenAddress.address.toString(),
    " ..."
  );

  splToken.TOKEN_PROGRAM_ID = tokenProgramId;
  const transactionHash = await splToken.mintTo(
    connection,
    senderWallet,
    new web3.PublicKey(mint_address),
    new web3.PublicKey(receiverTokenAddress.address.toString()),
    senderWallet.publicKey,
    amount * 1000000000
  );

  console.log("transactionHash==>", transactionHash);
  if (!transactionHash) {
    return null;
  }
  console.log("done");
  return transactionHash;
};

module.exports = { solanaTransaction };
