import { address } from "@solana/web3.js";
import { findAssociatedTokenPda } from "@solana-program/token";

//const OWNER = address("YOUR_WALLET_ADDRESS"); // e.g., E645TckHQnDcavVv92Etc6xSWQaq8zzPtPRGBheviRAk
//const MINT = address("YOUR_MINT_ACCOUNT"); // e.g., EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

const OWNER = new PublicKey('HecCDJPrmZ3t4qSrxsk8FxtiACLAsJZqpGRotL1pJoCL'); // YOUR_WALLET_ADDRESS
const MINT = new PublicKey('2UgWVdz7ys2uoEKsMDHgAWa2SG6LYNnJhDGoeAZ4PbbN');    // YOUR_MINT_ADDRESS 

const TOKEN_PROGRAM_ADDRESS = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

async function main() {
  const [ata] = await findAssociatedTokenPda({
    mint: MINT,
    owner: OWNER,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  console.log("Using Solana-Web3.j@2: ", ata);
};

main().catch(console.error);
