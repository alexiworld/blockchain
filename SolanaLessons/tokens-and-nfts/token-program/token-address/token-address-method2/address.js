const { PublicKey } = require('@solana/web3.js');

//const OWNER = new PublicKey('YOUR_WALLET_ADDRESS'); // e.g., E645TckHQnDcavVv92Etc6xSWQaq8zzPtPRGBheviRAk
//const MINT = new PublicKey('YOUR_MINT_ADDRESS');    // e.g., EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
const OWNER = new PublicKey('HecCDJPrmZ3t4qSrxsk8FxtiACLAsJZqpGRotL1pJoCL'); // YOUR_WALLET_ADDRESS
const MINT = new PublicKey('2UgWVdz7ys2uoEKsMDHgAWa2SG6LYNnJhDGoeAZ4PbbN');    // YOUR_MINT_ADDRESS 

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

const [address] = PublicKey.findProgramAddressSync(
    [OWNER.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), MINT.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
);

console.log('Using Solana-Web3.js: ', address.toBase58());
