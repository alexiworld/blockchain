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
//const nftAddress = publicKey('5UmTxMScPnoxQCtPYf86WPLGyp7QH7oC4pGcGr9qBciV');
//const nftAddress = publicKey('DHs6PhJh7Q85Z2DUsw824LxTgJUSCBSWrUnjk76cvFa8');
const nftAddress = publicKey('5wHCgPvqJ2sdNwh8ApVqHLzWALJhiJMVXV9YYH1beGrZ');

// Update the NFT metadata
const initialMetadata = await fetchMetadataFromSeeds(umi, {
  mint: nftAddress,
});

const transaction = await updateV1(umi, {
  mint: nftAddress,
  data: {
    ...initialMetadata,
    name: 'Updated Collection',
    symbol: 'UC',

    // A quick way to reset the uri to something anonymous.
    //uri: 'https://example.com',

    // Solana Explorer failed to load all of the following. It does not seem
    // uploading to ipfs using filebase.io or pinata.cloud services work. It
    // does not work arweave.net works if the json file is multi-line but
    // having all content on one line, it worked with arweave.net.
    //uri: 'https://closed-cyan-canid.myfilebase.com/ipfs/QmW48Aaak1NJcP5VxJdVKXiyxC215regFEnQkU8WvAy82i',
    //uri: 'https://closed-cyan-canid.myfilebase.com/ipns/k51qzi5uqu5dgte2ahwnyqgm7ka5xtnxsxykjfe1e1x9w0ijon794kxceaeart',
    //uri: 'https://ipfs.filebase.io/ipfs/QmPUN2LGUqvHqFZcWooy4xN5yEVjfMLwWuGvrAFGfH3yER',
    //uri: 'https://ipfs.io/ipfs/QmX7Hqqm1hwJV23ppVrTrb4uxZAHam7BxTfP8ktjJYrbA7',
    //uri: 'https://47hjzzgoe4zps2i4fv5gv2e7rjaq7fugtnatbpntihsiuuoelwlq.arweave.net/586c5M4nMvlpHC16auifikEPloabQTC9s0HkilHEXZc',
    //uri: 'https://arweave.net/586c5M4nMvlpHC16auifikEPloabQTC9s0HkilHEXZc',
    //uri: 'https://arweave.net/pKPpneOl99Nn3mJNPt_tuaiVDdW64GV2GCJ0f8cPGsA',
    //uri: 'https://ipfs.io/ipfs/QmaPD3xvHM2L3QsXatg6re9YFtzGd3JBE25PWWQQFrUW7y',

    // Solana Explorer works with the following two links. The first one's image
    // points to the original image. The second one's image points to own image.
    // Remember have the json file all in one line.
    //uri: 'https://arweave.net/1gU8uY-EFuktImuEat6G8SgUay4XtPWWXvcEejblEx0',
    uri: 'https://arweave.net/e5d1vBjToanuRhftvhz5wdClnJmzirMyxplVnNM2yQg',
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
