// See https://developers.metaplex.com/token-metadata/collections
import 'dotenv/config';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';

import { promises as fs } from 'fs';
import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from '@solana-developers/helpers';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
} from '@metaplex-foundation/umi';
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

// create a new connection to the cluster's API
const connection = new Connection(clusterApiUrl('devnet'));

// initialize a keypair for the user
// const user = await getKeypairFromFile();
const user = getKeypairFromEnvironment('SECRET_KEY');

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.1 * LAMPORTS_PER_SOL
);

console.log('Loaded user:', user.publicKey.toBase58());

// Create Umi Instance, using the same endpoint as our connection,
// and using our user to sign transactions
const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());
const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));
umi.use(irysUploader());

//
const collectionImagePath = path.resolve(__dirname, 'collection.png');

console.log(`collectionImagePath: ${collectionImagePath}`);
const buffer = await fs.readFile(collectionImagePath);
let file = createGenericFile(buffer, collectionImagePath, {
  contentType: 'image/png',
});
const [image] = await umi.uploader.upload([file]);
console.log('image uri:', image);

// upload offchain json to Arweave using irys
const uri = await umi.uploader.uploadJson({
  name: 'My Collection',
  symbol: 'MC',
  description: 'My Collection description',
  image,
});
console.log('Collection offchain metadata URI:', uri);
//

console.log(`Creating collection...`);
// This mint is like a factory for creating NFTs
// Except it only makes one NFT, and it's a collection!
const collectionMint = generateSigner(umi);
const transaction = await createNft(umi, {
  mint: collectionMint,
  name: 'My Collection',
  symbol: 'MC',
  // https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard
  // uri: 'https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-nft-collection-offchain-data.json',
  uri,
  updateAuthority: umi.identity.publicKey,
  sellerFeeBasisPoints: percentAmount(0),
  isCollection: true,
});

await transaction.sendAndConfirm(umi);

const createdCollectionNft = await fetchDigitalAsset(
  umi,
  collectionMint.publicKey
);

console.log(
  `Created collection 📦! Address is: ${getExplorerLink(
    'address',
    createdCollectionNft.mint.publicKey,
    'devnet'
  )}`
);

console.log('✅ Finished successfully!');
