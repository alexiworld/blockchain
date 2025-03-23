//fn main() {
//    println!("Hello, world!");
//}

use solana_sdk::pubkey::Pubkey;
use spl_associated_token_account::get_associated_token_address;
use std::str::FromStr;

//const OWNER: &str = "YOUR_WALLET_ADDRESS";
//const MINT: &str = "YOUR_MINT_ADDRESS";

const OWNER: &str = "HecCDJPrmZ3t4qSrxsk8FxtiACLAsJZqpGRotL1pJoCL";
const MINT: &str = "2UgWVdz7ys2uoEKsMDHgAWa2SG6LYNnJhDGoeAZ4PbbN";

fn main() {
    let owner_pubkey = Pubkey::from_str(OWNER).unwrap();
    let mint_pubkey = Pubkey::from_str(MINT).unwrap();
    let associated_token_address = get_associated_token_address(&owner_pubkey, &mint_pubkey);

    println!("Associated Token Address: {}", associated_token_address);
}


