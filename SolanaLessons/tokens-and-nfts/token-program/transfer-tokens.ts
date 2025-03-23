import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"));

const sender = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${sender.publicKey.toBase58()}`,
);

// Add the recipient public key here.
// const recipient = new PublicKey("YOUR_RECIPIENT_HERE");
// Not recipient token account address but recipient address is needed here. 
// The recipient token account addresss a.k.a. desitnation token account will 
// be calculated a few lines later.
// const recipient = new PublicKey("7wSfxf29q9XzdmKKbuTBSnQLwSFTgygJVa2tMhwpbFEp");
const recipient = new PublicKey("EAC9c58fqMDD9NaoTZJcLxXkrtRTL6zxJ2G632NEi9Tq");

// Substitute in your token mint account
// const tokenMintAccount = new PublicKey("YOUR_TOKEN_MINT_ADDRESS_HERE");
const tokenMintAccount = new PublicKey("H3fC8X2PgNX54UZwti8GKiiZmPTeKGznmVGqkAny7wfs");

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);
console.log(`?~_~R? Attempt by ${sender.publicKey.toBase58()}...`);

// Get or create the source token account to store this token
const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAccount,
  sender.publicKey,
);

// Get or create the destination token account to store this token
const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAccount,
  recipient,
);

//console.log(`?~_~R? Source token account ${sourceTokenAccount.publicKey.toBase58()}...`);
//console.log(`?~_~R? Destination token account ${destinationTokenAccount.publicKey.toBase58()}...`);

console.log(`?~_~R? Source (associated) token account ${sourceTokenAccount.address}...`);
console.log(`?~_~R? Destination (associated) token account ${destinationTokenAccount.address}...`);

// Transfer the tokens
const signature = await transfer(
  connection,
  sender,
  sourceTokenAccount.address,
  destinationTokenAccount.address,
  sender,
  1 * MINOR_UNITS_PER_MAJOR_UNITS,
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}`);

