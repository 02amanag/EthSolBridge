const { getOrCreateAssociatedTokenAccount } = require("@solana/spl-token");

const splToken = require("@solana/spl-token");
const web3 = require("@solana/web3.js");

const senderWallet = web3.Keypair.fromSecretKey(
  Uint8Array.from([
    197, 123, 102, 90, 40, 117, 68, 211, 177, 122, 161, 72, 247, 58, 109, 152,
    155, 190, 144, 38, 21, 119, 83, 199, 207, 135, 26, 47, 14, 161, 139, 234,
    70, 137, 142, 194, 138, 72, 172, 157, 93, 118, 250, 207, 139, 166, 93, 18,
    51, 203, 156, 91, 54, 243, 131, 180, 166, 67, 98, 56, 103, 125, 130, 188,
  ]) //replace with mint_address owner secret_key_array from devnet
);

// configuration
const connection = new web3.Connection("https://api.devnet.solana.com");
const mint_address = "6d7j8E4RuXZsy4tNFzmZ8QV7rf6Pn575iHLyMX7VdeZ2";
const tokenProgramId = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

//  this function transfer amount of token to receiverAddress of solana
const solanaTransaction = async (amount, receiverAddresss) => {
  // recivers wallet address
  // const reciverAddresses = "CenakKgtM5Em6kLtbcJV75oQAHVLfBk7zsjbXNAytd2t";

  //  get token account for receiverAddresss of our token
  const receiverTokenAddress = await getOrCreateAssociatedTokenAccount(
    connection,
    senderWallet,
    new web3.PublicKey(mint_address),
    new web3.PublicKey(receiverAddresss)
  );
  console.log("Receiver token abalance ->", receiverTokenAddress.amount);
  console.log(
    "Receiver token address -> ",
    receiverTokenAddress.address.toString()
  );

  console.log(
    "Sending",
    amount,
    "Token to",
    receiverTokenAddress.address.toString(),
    " ..."
  );

  // transaction
  splToken.TOKEN_PROGRAM_ID = tokenProgramId;
  const transactionHash = await splToken.mintTo(
    connection,
    senderWallet,
    new web3.PublicKey(mint_address),
    new web3.PublicKey(receiverTokenAddress.address.toString()),
    senderWallet.publicKey,
    amount * 1000000000
  );

  console.log("transactionHash ==> ", transactionHash);
  if (!transactionHash) {
    return null;
  }
  return transactionHash;
};

module.exports = { solanaTransaction };
