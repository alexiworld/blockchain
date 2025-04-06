import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  NONCE_ACCOUNT_LENGTH,
  NonceAccount,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  DurableNonceTransactionConfirmationStrategy,
} from '@solana/web3.js';
import { initializeKeypair, airdropIfRequired, getExplorerLink } from '@solana-developers/helpers';
import { assert } from 'chai';

const LOCALHOST_RPC_URL = 'http://localhost:8899';
const CONFIRMATION_COMMITMENT = 'confirmed';
const AIRDROP_AMOUNT = 3 * LAMPORTS_PER_SOL;
const MINIMUM_BALANCE = 1 * LAMPORTS_PER_SOL;
const TRANSFER_AMOUNT = 0.1 * LAMPORTS_PER_SOL;

const connection = new Connection(LOCALHOST_RPC_URL, CONFIRMATION_COMMITMENT);

async function createNonceAccount(
  connection: Connection,
  payer: Keypair,
  nonceKeypair: Keypair,
  authority: PublicKey,
): Promise<NonceAccount> {
  // Assemble and submit a transaction that will:
  const transaction = new Transaction().add(
    // 1. Allocate the account that will be the nonce account.
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: nonceKeypair.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH),
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    }),
    // 2. Initialize the nonce account using the `SystemProgram.nonceInitialize` instruction.
    SystemProgram.nonceInitialize({
      noncePubkey: nonceKeypair.publicKey,
      authorizedPubkey: authority,
    }),
  );

  const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [payer, nonceKeypair]);
  console.log(
    'Verify transaction details for creating nonce account ',
    getExplorerLink('transaction', transactionSignature, 'localnet'),
  );

  // Fetch and return the nonce account.
  const accountInfo = await connection.getAccountInfo(nonceKeypair.publicKey);
  return NonceAccount.fromAccountData(accountInfo!.data);
}

describe('Durable Nonce Transactions', () => {
  it('creates and submits a durable transaction successfully', async () => {
    const payer = await initializeKeypair(connection);
    await airdropIfRequired(connection, payer.publicKey, AIRDROP_AMOUNT, MINIMUM_BALANCE);

    const [nonceKeypair, recipient] = [Keypair.generate(), Keypair.generate()];

    // Create the nonce account
    const nonceAccount = await createNonceAccount(connection, payer, nonceKeypair, payer.publicKey);

    // Create a durable transaction
    const durableTransaction = new Transaction();
    durableTransaction.feePayer = payer.publicKey;
    durableTransaction.recentBlockhash = nonceAccount.nonce;

    // Add the `nonceAdvance` instruction as the first instruction in the transaction
    durableTransaction.add(
      SystemProgram.nonceAdvance({
        authorizedPubkey: payer.publicKey,
        noncePubkey: nonceKeypair.publicKey,
      }),
    );

    // Add the transfer instruction
    durableTransaction.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient.publicKey,
        lamports: TRANSFER_AMOUNT,
      }),
    );

    // Sign the transaction
    durableTransaction.sign(payer);

    try {
      // Get the current slot to use as minContextSlot
      const slot = await connection.getSlot();

      // Send the transaction first to get the signature
      const transactionSignature = await connection.sendRawTransaction(durableTransaction.serialize(), {
        skipPreflight: true,
      });

      // Create the confirmation strategy
      const confirmationStrategy: DurableNonceTransactionConfirmationStrategy = {
        signature: transactionSignature,
        minContextSlot: slot,
        nonceAccountPubkey: nonceKeypair.publicKey,
        nonceValue: nonceAccount.nonce,
      };

      // Confirm the durable transaction
      await connection.confirmTransaction(confirmationStrategy);
      console.log('Verify transaction details - ', getExplorerLink('transaction', transactionSignature, 'localnet'));
      assert.ok(transactionSignature, 'Transaction should be successful');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new Error(`Failed to submit durable transaction: ${error.message}`);
      } else {
        throw new Error(`Failed to submit durable transaction: Unknown error`);
      }
    }
  });

  it('fails when attempting to use an advanced nonce', async () => {
    const payer = await initializeKeypair(connection);
    await airdropIfRequired(connection, payer.publicKey, AIRDROP_AMOUNT, MINIMUM_BALANCE);

    const [nonceKeypair, nonceAuthority, recipient] = [Keypair.generate(), Keypair.generate(), Keypair.generate()];

    // Create the nonce account
    const nonceAccount = await createNonceAccount(connection, payer, nonceKeypair, nonceAuthority.publicKey);

    // Create a durable transaction
    const durableTransaction = new Transaction();
    durableTransaction.feePayer = payer.publicKey;
    durableTransaction.recentBlockhash = nonceAccount.nonce;

    durableTransaction.add(
      SystemProgram.nonceAdvance({
        authorizedPubkey: nonceAuthority.publicKey,
        noncePubkey: nonceKeypair.publicKey,
      }),
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient.publicKey,
        lamports: TRANSFER_AMOUNT,
      }),
    );

    durableTransaction.sign(payer, nonceAuthority);

    // Advance the nonce
    try {
      await sendAndConfirmTransaction(
        connection,
        new Transaction().add(
          SystemProgram.nonceAdvance({
            noncePubkey: nonceKeypair.publicKey,
            authorizedPubkey: nonceAuthority.publicKey,
          }),
        ),
        [payer, nonceAuthority],
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to advance nonce: ${error.message}`);
      } else {
        throw new Error(`Failed to advance nonce: Unknown error`);
      }
    }

    // Try to submit the transaction, and it should fail
    try {
      const slot = await connection.getSlot();
      const transactionSignature = await connection.sendRawTransaction(durableTransaction.serialize(), {
        skipPreflight: true,
      });

      const confirmationStrategy: DurableNonceTransactionConfirmationStrategy = {
        signature: transactionSignature,
        minContextSlot: slot,
        nonceAccountPubkey: nonceKeypair.publicKey,
        nonceValue: nonceAccount.nonce,
      };

      await connection.confirmTransaction(confirmationStrategy, CONFIRMATION_COMMITMENT);
      console.log('Verify transaction details - ', getExplorerLink('transaction', transactionSignature, 'localnet'));
      assert.fail('Transaction should have failed');
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      assert.ok(error, 'Transaction should fail due to advanced nonce');
    }
  });

  it('advances the nonce account even when the transaction fails', async () => {
    const payer = await initializeKeypair(connection);
    await airdropIfRequired(connection, payer.publicKey, AIRDROP_AMOUNT, MINIMUM_BALANCE);

    const [nonceKeypair, nonceAuthority, recipient] = [Keypair.generate(), Keypair.generate(), Keypair.generate()];

    // Create the nonce account
    const nonceAccount = await createNonceAccount(connection, payer, nonceKeypair, nonceAuthority.publicKey);
    const nonceBeforeAdvancing = nonceAccount.nonce;

    const balanceBefore = await connection.getBalance(payer.publicKey);

    // Create a durable transaction that will fail (transferring more than the balance)
    const durableTransaction = new Transaction();
    durableTransaction.feePayer = payer.publicKey;
    durableTransaction.recentBlockhash = nonceAccount.nonce;

    durableTransaction.add(
      SystemProgram.nonceAdvance({
        authorizedPubkey: nonceAuthority.publicKey,
        noncePubkey: nonceKeypair.publicKey,
      }),
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient.publicKey,
        lamports: balanceBefore + LAMPORTS_PER_SOL, // Intentionally more than the balance
      }),
    );

    durableTransaction.sign(payer, nonceAuthority);

    try {
      const slot = await connection.getSlot();
      const transactionSignature = await connection.sendRawTransaction(durableTransaction.serialize(), {
        skipPreflight: true,
      });

      const confirmationStrategy: DurableNonceTransactionConfirmationStrategy = {
        signature: transactionSignature,
        minContextSlot: slot,
        nonceAccountPubkey: nonceKeypair.publicKey,
        nonceValue: nonceAccount.nonce,
      };

      // When `skipPreflight` is enabled, the transaction is sent directly to the network without any client-side checks, including balance checks.
      // This means that the transaction will be processed by the network, and the nonce will be advanced, even if the transfer itself fails due to insufficient funds.
      await connection.confirmTransaction(confirmationStrategy, CONFIRMATION_COMMITMENT);
      console.log('Verify transaction details - ', getExplorerLink('transaction', transactionSignature, 'localnet'));
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error:', error.message);
      }
      assert.ok(error, 'Transaction should fail due to insufficient funds');
    }

    // Check if the nonce has advanced
    const updatedNonceAccount = await connection.getNonce(nonceKeypair.publicKey);
    assert.notEqual(nonceBeforeAdvancing, updatedNonceAccount?.nonce, 'Nonce should have advanced');
  });

  it('does not advance the nonce account when the nonce authority fails to sign', async () => {
    const payer = await initializeKeypair(connection);
    await airdropIfRequired(connection, payer.publicKey, AIRDROP_AMOUNT, MINIMUM_BALANCE);

    const [nonceKeypair, nonceAuthority, recipient] = [Keypair.generate(), Keypair.generate(), Keypair.generate()];

    // Create the nonce account
    const nonceAccount = await createNonceAccount(connection, payer, nonceKeypair, nonceAuthority.publicKey);
    const nonceBeforeAdvancing = nonceAccount.nonce;

    // Create a durable transaction
    const durableTransaction = new Transaction();
    durableTransaction.feePayer = payer.publicKey;
    durableTransaction.recentBlockhash = nonceAccount.nonce;

    durableTransaction.add(
      SystemProgram.nonceAdvance({
        authorizedPubkey: nonceAuthority.publicKey,
        noncePubkey: nonceKeypair.publicKey,
      }),
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient.publicKey,
        lamports: TRANSFER_AMOUNT,
      }),
    );

    // Intentionally not signing with nonceAuthority
    durableTransaction.sign(payer);

    try {
      const slot = await connection.getSlot();
      const transactionSignature = await connection.sendRawTransaction(durableTransaction.serialize(), {
        skipPreflight: true,
      });

      const confirmationStrategy: DurableNonceTransactionConfirmationStrategy = {
        signature: transactionSignature,
        minContextSlot: slot,
        nonceAccountPubkey: nonceKeypair.publicKey,
        nonceValue: nonceAccount.nonce,
      };

      await connection.confirmTransaction(confirmationStrategy, CONFIRMATION_COMMITMENT);
      console.log('Verify transaction details - ', getExplorerLink('transaction', transactionSignature, 'localnet'));
      assert.fail('Transaction should have failed');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      assert.ok(error, 'Transaction should fail due to missing nonce authority signature');
    }

    // Check if the nonce has remained the same
    const updatedNonceAccount = await connection.getNonce(nonceKeypair.publicKey);
    assert.equal(nonceBeforeAdvancing, updatedNonceAccount?.nonce, 'Nonce should not have advanced');
  });

  it('submits successfully after changing the nonce authority to a pre-signed address', async () => {
    const payer = await initializeKeypair(connection);
    await airdropIfRequired(connection, payer.publicKey, AIRDROP_AMOUNT, MINIMUM_BALANCE);

    const [nonceKeypair, initialNonceAuthority, recipient] = [
      Keypair.generate(),
      Keypair.generate(),
      Keypair.generate(),
    ];

    // Create the nonce account
    const nonceAccount = await createNonceAccount(connection, payer, nonceKeypair, initialNonceAuthority.publicKey);

    // Create a durable transaction
    const durableTransaction = new Transaction();
    durableTransaction.feePayer = payer.publicKey;
    durableTransaction.recentBlockhash = nonceAccount.nonce;

    durableTransaction.add(
      SystemProgram.nonceAdvance({
        authorizedPubkey: payer.publicKey, // New nonce authority
        noncePubkey: nonceKeypair.publicKey,
      }),
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient.publicKey,
        lamports: TRANSFER_AMOUNT,
      }),
    );

    durableTransaction.sign(payer);

    // Change nonce authority
    try {
      await sendAndConfirmTransaction(
        connection,
        new Transaction().add(
          SystemProgram.nonceAuthorize({
            noncePubkey: nonceKeypair.publicKey,
            authorizedPubkey: initialNonceAuthority.publicKey,
            newAuthorizedPubkey: payer.publicKey,
          }),
        ),
        [payer, initialNonceAuthority],
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to change nonce authority: ${error.message}`);
      } else {
        throw new Error(`Failed to change nonce authority: Unknown error`);
      }
    }

    // Submit the durable transaction
    try {
      // Get the current slot to use as minContextSlot
      const slot = await connection.getSlot();

      // Send the transaction first to get the signature
      const transactionSignature = await connection.sendRawTransaction(durableTransaction.serialize(), {
        skipPreflight: true,
      });

      // Create the confirmation strategy
      const confirmationStrategy: DurableNonceTransactionConfirmationStrategy = {
        signature: transactionSignature,
        minContextSlot: slot,
        nonceAccountPubkey: nonceKeypair.publicKey,
        nonceValue: nonceAccount.nonce,
      };

      // Confirm the durable transaction
      await connection.confirmTransaction(confirmationStrategy, CONFIRMATION_COMMITMENT);
      console.log('Verify transaction details - ', getExplorerLink('transaction', transactionSignature, 'localnet'));
      assert.ok(transactionSignature, 'Transaction should be successful after changing nonce authority');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new Error(`Failed to submit transaction after changing nonce authority: ${error.message}`);
      } else {
        throw new Error(`Failed to submit transaction after changing nonce authority: Unknown error`);
      }
    }
  });
});
