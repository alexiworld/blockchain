import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

let publicKey = process.argv[2];

if (process.argv[2]) {
	publicKey = new PublicKey(process.argv[2])
} else {	
	const keypair = getKeypairFromEnvironment("SECRET_KEY");
	
	console.log(
		`?~\~E Finished! We've loaded our secret key securely, using an env file!`
	);
	
	console.log(`The public key is: `, keypair.publicKey.toBase58());
	console.log(`The secret key is: `, keypair.secretKey);
	
	publicKey = new PublicKey(keypair.publicKey.toBase58());
}

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(
  `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`,
);
