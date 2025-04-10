import 'dotenv/config';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';

const keypair = getKeypairFromEnvironment('SECRET_KEY');

console.log(
  `✅ Finished! We've loaded our secret key securely, using an env file!`
);

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);

const bs58 = require('bs58');
console.log(`The secret key is: `, bs58.encode(keypair.secretKey));
