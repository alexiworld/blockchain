import { FC } from 'react'
import styles from '../styles/Home.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'

import dynamic from 'next/dynamic';

// https://solana.stackexchange.com/questions/4304/error-hydration-failed-because-the-initial-ui-does-not-match-what-was-rendered
// https://github.com/anza-xyz/wallet-adapter/issues/648 leads to:
// https://github.com/anza-xyz/wallet-adapter/commit/70fd5aac6eaf9584b0e3034685236a850e3488e4 having example for WalletDisconnectButton as well

// add this
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" height={30} width={200} alt="image alt"/>
            <span>Wallet-Adapter Example</span>
            <WalletMultiButtonDynamic />
        </div>
    )
}
