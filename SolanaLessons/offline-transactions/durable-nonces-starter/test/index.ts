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

describe('Durable Nonce Transactions', () => {
  it('creates and submits a durable transaction successfully', async () => {
    // Implementation will be added later
  });

  it('fails when attempting to use an advanced nonce', async () => {
    // Implementation will be added later
  });

  it('advances the nonce account even when the transaction fails', async () => {
    // Implementation will be added later
  });

  it('does not advance the nonce account when the nonce authority fails to sign', async () => {
    // Implementation will be added later
  });

  it('submits successfully after changing the nonce authority to a pre-signed address', async () => {
    // Implementation will be added later
  });
});
