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
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
	createMintToInstruction,
	getAssociatedTokenAddress,
} from "@solana/spl-token";

export const MintTokensForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  };


	const mintTokens = async (event) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }
    const transaction = new web3.Transaction();
    const recipient = new web3.PublicKey(event.target.recipient.value);
    const mint = new web3.PublicKey(event.target.mint.value);
    const amount = parseInt(event.target.amount.value);

		const associatedTokenAddress = await getAssociatedTokenAddress(
			mint,
			recipient,
			false,
			TOKEN_PROGRAM_ID,
			ASSOCIATED_TOKEN_PROGRAM_ID
		);

		console.log(`Associated Token Account address: ${associatedTokenAddress}`);

		transaction.add(
			createMintToInstruction(
				mint,
				associatedTokenAddress,
				publicKey,
				amount,
				[],
				TOKEN_PROGRAM_ID
			)
		);

		sendTransaction(transaction, connection).then((sig) => {
			console.log(`Signature: ${sig}`);
		  setTxSig(sig);
		});	
  };

  return (
    <div>
      <br />
      {publicKey ? (
        <form onSubmit={mintTokens} className={styles.form}>
          <label htmlFor="owner">Token Mint:</label>
          <input
            id="mint"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Mint, e.g. AaUnDTi39XHvm155JtqJPDv8KT9QZ89XrM6QzRAz3fJE"
            required
          />
          <label htmlFor="recipient">Recipient:</label>
          <input
            id="recipient"
            type="text"
            className={styles.formField}
            placeholder="Enter Recipient PublicKey, e.g. HecCDJPrmZ3t4qSrxsk8FxtiACLAsJZqpGRotL1pJoCL"
            required
          />
          <label htmlFor="amount">Amount Tokens to Mint:</label>
          <input
            id="amount"
            type="text"
            className={styles.formField}
            placeholder="Enter Amount to Mint, e.g. 100"
            required
          />
          <button type="submit" className={styles.formButton}>
            Mint Tokens
          </button>
        </form>
      ) : (
        <span></span>
      )}
      {txSig ? (
        <div>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  );
};

