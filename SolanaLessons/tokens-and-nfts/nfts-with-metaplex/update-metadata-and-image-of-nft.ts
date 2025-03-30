import 'dotenv/config';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import {
  fetchDigitalAsset,
  fetchMetadataFromSeeds,
  mplTokenMetadata,
  updateV1,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from '@solana-developers/helpers';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
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
const umi = createUmi(connection.rpcEndpoint).use(mplTokenMetadata());
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiKeypair));

// Our NFT we made earlier
//const nftAddress = publicKey("YOUR_NFT_ADDRESS_HERE");
const nftAddress = publicKey('5UmTxMScPnoxQCtPYf86WPLGyp7QH7oC4pGcGr9qBciV');

// Update the NFT metadata
const initialMetadata = await fetchMetadataFromSeeds(umi, {
  mint: nftAddress,
});

const transaction = await updateV1(umi, {
  mint: nftAddress,
  data: {
    ...initialMetadata,
    name: 'Updated NFT',
    symbol: 'UN',
    //uri: 'https://arweave.net/PK3Url31k4BYNvYOgTuYgWuCLrNjl5BrrF5lbY9miR8', // original link
    //uri: 'https://arweave.net/wM3BonpmVVwUZ8svT1sQ0sC7pqldy86v2fytOlpaM5k', // copy of the content of the original link but uploaded to diff CID
    uri: 'https://arweave.net/ubVtyhKpEArdz3b0u1avorF8DXmUuiFc1FXTJEp1teQ', // copy of the content of the original link but image changed with cross.
  },
});

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi, nftAddress);

console.log(
  `🆕 NFT updated with new metadata: ${getExplorerLink(
    'address',
    createdNft.mint.publicKey,
    'devnet'
  )}`
);

console.log('✅ Finished successfully!');
