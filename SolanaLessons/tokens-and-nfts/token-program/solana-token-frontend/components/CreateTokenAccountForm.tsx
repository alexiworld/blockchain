import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, useState } from "react";
import styles from "../styles/Home.module.css";

// Solana Web3 APIs:
// https://solana-labs.github.io/solana-web3.js/classes/Connection.html#sendtransaction
// SPL-Token APIs:
// https://solana-labs.github.io/solana-program-library/token/js/functions/getOrCreateAssociatedTokenAccount.html
import {
  //getAssociatedTokenAddressSync,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
	//createAssociatedTokenAccountIdempotentInstruction,
  getOrCreateAssociatedTokenAccount
} from "@solana/spl-token";

export const CreateTokenAccountForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  };


	const createTokenAccount = async (event) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }
    const transaction = new web3.Transaction();
    const owner = new web3.PublicKey(event.target.owner.value);
    const mint = new web3.PublicKey(event.target.mint.value);

		const associatedToken = await getOrCreateAssociatedTokenAccount(
			connection,
			publicKey,
			mint,
			owner,
			false,
			TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
		);

		console.log(`Associated Token Account: ${associatedToken}`);

		if (associatedToken) {
			setTokenAccount(associatedToken.address.toString());
		} else {
			// It returns the associated token without 'await' before invocation
			//const associatedTokenSync = getAssociatedTokenAddressSync(mint, owner);
			//console.log('Using SPL-Token: ', associatedTokenSync.toBase58());

	    	const associatedTokenAddress = await getAssociatedTokenAddress(
  		   	mint,
  		    owner,
					false,
		      TOKEN_PROGRAM_ID,
		      ASSOCIATED_TOKEN_PROGRAM_ID
		    );

		    console.log(`Associated Token Account address to be: ${associatedTokenAddress}`);

		    transaction.add(
					//createAssociatedTokenAccountIdempotentInstruction( // succeeds even if exists
		      createAssociatedTokenAccountInstruction( // fails if exists
		        publicKey,
		        associatedTokenAddress,
		        owner,
		        mint,
		        TOKEN_PROGRAM_ID,
		        ASSOCIATED_TOKEN_PROGRAM_ID
		      )
		    );

		    sendTransaction(transaction, connection).then((sig) => {
					console.log(`Signature: ${sig}`);
		      setTxSig(sig);
		      setTokenAccount(associatedTokenAddress.toString());
		    });
		}
  };

  return (
    <div>
      <br />
      {publicKey ? (
        <form onSubmit={createTokenAccount} className={styles.form}>
          <label htmlFor="owner">Token Mint:</label>
          <input
            id="mint"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Mint, e.g. AaUnDTi39XHvm155JtqJPDv8KT9QZ89XrM6QzRAz3fJE"
            required
          />
          <label htmlFor="owner">Token Account Owner:</label>
          <input
            id="owner"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Account Owner PublicKey, e.g. HecCDJPrmZ3t4qSrxsk8FxtiACLAsJZqpGRotL1pJoCL"
            required
          />
          <button type="submit" className={styles.formButton}>
            Create Token Account
          </button>
        </form>
      ) : (
        <span></span>
      )}
      {tokenAccount ? (
        <div>
          <p>Token Account Address: {tokenAccount}</p>
        </div>
      ) : null}
      {txSig ? (
        <div>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  );
};

