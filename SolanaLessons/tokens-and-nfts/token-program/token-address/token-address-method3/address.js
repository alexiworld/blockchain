const { PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddressSync } = require('@solana/spl-token');

//const OWNER = new PublicKey('YOUR_WALLET_ADDRESS'); // e.g., E645TckHQnDcavVv92Etc6xSWQaq8zzPtPRGBheviRAk
//const MINT = new PublicKey('YOUR_MINT_ADDRESS');    // e.g., EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
const OWNER = new PublicKey('HecCDJPrmZ3t4qSrxsk8FxtiACLAsJZqpGRotL1pJoCL'); // YOUR_WALLET_ADDRESS
const MINT = new PublicKey('2UgWVdz7ys2uoEKsMDHgAWa2SG6LYNnJhDGoeAZ4PbbN');    // YOUR_MINT_ADDRESS 

const address2 = getAssociatedTokenAddressSync(MINT, OWNER);

console.log('Using SPL-Token: ', address2.toBase58());
