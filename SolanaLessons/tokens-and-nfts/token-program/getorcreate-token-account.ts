import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import "dotenv/config";
import {
	getExplorerLink,
	getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { sendAndConfirmTransaction, Transaction, Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`,
);

// Substitute in your token mint account from create-token-mint.ts
// const tokenMintAccount = new PublicKey("H3fC8X2PgNX54UZwti8GKiiZmPTeKGznmVGqkAny7wfs");
const mint = new PublicKey("AaUnDTi39XHvm155JtqJPDv8KT9QZ89XrM6QzRAz3fJE");

// Here we are making an associated token account for our own address, but we can
// make an ATA on any other wallet in devnet!
const owner = user.publicKey;

const tokenAccount = await getOrCreateAssociatedTokenAccount(
	connection,
	user,
	mint,
	owner,
);

if (tokenAccount) {
	console.log(`Token Account: ${tokenAccount.address.toBase58()} exists.`);

	const link = getExplorerLink(
		"address",
		tokenAccount.address.toBase58(),
		"devnet"
	);

	console.log(`✅ Token Account Link in Solana Explorer: ${link}`);
} else {

	const associatedTokenAddress = await getAssociatedTokenAddress(
		mint,
  	user.publicKey,
  	false,
	);

	console.log(`Token Account address to be: ${associatedTokenAddress}`);

	const transaction = new Transaction().add(
  	createAssociatedTokenAccountInstruction(
			user.publicKey,
    	associatedTokenAddress,
    	user.publicKey,
    	mint,
  	),
	);

	sendTransaction(transaction, connection).then((sig) => {
		console.log(`?~\~E Signature: ${sig}`);
	});

  const link = getExplorerLink(
    "address",
    tokenAccountAddress.toBase58(),
    "devnet"
  );

  console.log(`?~\~E Token Account Link in Solana Explorer: ${link}`);
}
