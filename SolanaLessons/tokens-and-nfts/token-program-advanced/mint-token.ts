import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const user = getKeypairFromEnvironment("SECRET_KEY");

// Substitute in your token mint account from create-token-mint.ts
// const tokenMintAccount = new PublicKey("YOUR_TOKEN_MINT_ACCOUNT");
const tokenMintAccount = new PublicKey("2UgWVdz7ys2uoEKsMDHgAWa2SG6LYNnJhDGoeAZ4PbbN");

// Substitute in your own, or a friend's token account address, based on the previous step.
// const recipientAssociatedTokenAccount = new PublicKey("RECIPIENT_TOKEN_ACCOUNT");
// Note that this is not owner public key but the public key of the associated token account.
// The other way would be to derive the associated token account address from the owner and 
// mint addresses as this is done in the other examples using getAssociatedTokenAddress fn.
const recipientAssociatedTokenAccount = new PublicKey("xQYbfPKGXBPeZTrVfBKDfrrpnKB1ZwWVAEBxt4isSwa");

const transactionSignature = await mintTo(
  connection,
  user,
  tokenMintAccount,
  recipientAssociatedTokenAccount,
  user,
  1000 * MINOR_UNITS_PER_MAJOR_UNITS,
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);
