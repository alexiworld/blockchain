# Source
# https://solana.com/developers/courses/offline-transactions/durable-nonces#0-getting-started
# https://github.com/Unboxed-Software/solana-lab-durable-nonces

git difftool --tool=vimdiff solution:test/index.ts new-solution:test/index.ts
diff -y -W 170 <(git show solution:test/index.ts) <(git show new-solution:test/index.ts)
diff -y durable-nonces-solution/test/index.ts durable-nonces-new-solution/test/index.ts

---
root@185ee0f3ce88:/blockchain/SolanaLessons/offline-transactions/durable-nonces-solution# npm run start

> solana-token-metadata-client@1.0.0 start
> ts-mocha --timeout 40000 test/**.ts

(node:4794) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:4794) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///blockchain/SolanaLessons/offline-transactions/durable-nonces-solution/test/index.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /blockchain/SolanaLessons/offline-transactions/durable-nonces-solution/package.json.


  transfer-hook
Creating Nonce TX: https://explorer.solana.com/tx/4ZCZ1BcMFyfv5LqYEgTAPhmKASjCiNJvSuCsvkBWVTh8GHCg8BpPdyQPP8pctkZU5nqzDPZeQHWDLaqjBhpinTG6?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Transaction Signature: https://explorer.solana.com/tx/2bd1XYrFxUji2uvtc7qXEV8CbL62jF1d5W1QEK3qVP9CkmqdsFr1S8s21HcQyAH2ANz8MovTuaD9apMDBS5KzTW7?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
    ✔ Creates a durable transaction and submits it (14271ms)
Creating Nonce TX: https://explorer.solana.com/tx/62e8EMAhxXHZQUZ2WuyjKBNxomnjXQFtMoreeLXDs6uKm4SQNj2JUA92mYqscHPr29zLfoQXVsv9EUKDggUfecJ1?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Nonce Advance Signature: https://explorer.solana.com/tx/jj4TVEbyXaj3nqAxJvQy5n6QGTCfETcx2SDekNKepbZ16xqQHdz9woBUosHwZtdR4cZAKGBqmDQfEvmxdUn7eb5?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
    ✔ Fails if the nonce has advanced (834ms)
Creating Nonce TX: https://explorer.solana.com/tx/3zHCdgHpcJQCGjvMj8TDptE7FRQFXM84rQnMvnbL9G2FADPdJSzgAAage5nJtSFsvncMpFdHD7fuPfxevoLe6J5?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Nonce Before Advancing: J3KHHwUZw1JHW64sPQP7CcHen6p1mUEoFbPtGUE9MW7G
    ✔ Advances the nonce account even if the transaction fails (817ms)
Creating Nonce TX: https://explorer.solana.com/tx/53AAg2baSn7kFGEiPErorWL8ZuzddkBNz85K1k4b991KZc8pW51Cz1jq9vvLRsB5NjZqyYVV8C5EdertAsJzLnxS?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Nonce before submitting: DUQa8jdPSKEyvCdVS7gbYtqY5tySK4TGHU2gtycNnjuM
    ✔ The nonce account will not advance if the transaction fails because the nonce auth did not sign the transaction (30441ms)
Creating Nonce TX: https://explorer.solana.com/tx/5PucziC18XZgTpyx7RrUMN4uQGZQgs8qDZuBQhbgkYy5Kb5EQPAseFFWhEyAsW4we7vdBGr4UACbRKTCTCyrPquz?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Nonce before submitting: CVBxedc9nnGFVN3qk8CPgC2LUkq9AaiYP9DRSAXAFYaY
Nonce Auth Signature: https://explorer.solana.com/tx/yJaD7wwJZgWxZNbtGxz7GAEXqKhoRm2tPWjnfRCjXGGVYwQuYavRAcXJZYhJEvFANPbyvAgtHFgL2YBpiG7NiLo?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Transaction Signature: https://explorer.solana.com/tx/3jYGzF3FvSX7Xph3khMYdeRsktjiDF9arrSq3hwJYXrEpQCfRKhAKae9ebYYLVbwsKBX1op7225ReVDb4gwtxXC?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
    ✔ Submits after changing the nonce auth to an already signed address (30309ms)


  5 passing (1m)
---
root@185ee0f3ce88:/blockchain/SolanaLessons/offline-transactions/durable-nonces-new-solution# npm install

up to date, audited 298 packages in 2s

54 packages are looking for funding
  run `npm fund` for details

6 vulnerabilities (4 moderate, 2 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
root@185ee0f3ce88:/blockchain/SolanaLessons/offline-transactions/durable-nonces-new-solution# npm run start

> solana-token-metadata-client@1.0.0 start
> ts-mocha -r tsx --timeout 40000 test/**.ts



  Durable Nonce Transactions
Verify transaction details for creating nonce account  https://explorer.solana.com/tx/3Y4zAcXoub1peu9Xivx7yXvkUSxNnEF2Q54Tup3ZDPppdtz4RhdvEmP8MnXFamMPVGkRsb74BpiHH6aydYDam4iV?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Verify transaction details -  https://explorer.solana.com/tx/5FF5ckM9vxbCnhZZcf2HaX9GcSB2qpGpQ5r64ne1k4xZjxFL87REoX4quEiSjBcdf5FMFAHYHudfXrfuyZhYLAbo?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
    ✔ creates and submits a durable transaction successfully (13970ms)
Verify transaction details for creating nonce account  https://explorer.solana.com/tx/2iMN9zVNJTGJJGpwrxsddU7bQmNsU5aHzKdXcxJTTnQara8ynv2qpitQV7KWHqRrYL46DaHmu1w26KKAffyKrY2f?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Signature 3oGY3EL88bg8jkQ613oA8FjVTBQeTffWTz2CFAK6Z4tpuc821JuGFeSZPr2TTafnHrPrae8SEs6ZA9kXH3GQkYWS has expired: the nonce is no longer valid.
    ✔ fails when attempting to use an advanced nonce (14162ms)
Verify transaction details for creating nonce account  https://explorer.solana.com/tx/3WMoM2wAHhWeSmezUqZXpR3iZW3WoF22NsfU2U2nAvtvVGY1ef23VshtisvtHo6b1KJLBLTXwMJyEYxPZmNGdf5K?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Verify transaction details -  https://explorer.solana.com/tx/38YkwjeFL5DhP2d51Y6dPAhn2MRB6wDJHFpkMViJkcc8u9Xsb6mwY2oYHeTmNP8YKhtDrx4n88mxURckoUnd1YGg?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
    ✔ advances the nonce account even when the transaction fails (14124ms)
Verify transaction details for creating nonce account  https://explorer.solana.com/tx/3tUZUxmm6ZtDfYSX5z4Q1n4ehes4jBa4MHahLWyeL9Pfauk2FENoathJDS8KeqYPEfDLHFdqBMuZb8bHi8ayExXS?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Signature verification failed.
Missing signature for public key [`FVjS4tBsVWRVdQiJS9ao6gG1RxMYtHMjUvpuAJQcGqGx`].
    ✔ does not advance the nonce account when the nonce authority fails to sign (13772ms)
Verify transaction details for creating nonce account  https://explorer.solana.com/tx/2WSZmCevo1hXwqircKzEN2HxZ4XEGgUwxAByGRkdBcr1dQNLudqeQmaLrN97WoAn4qCoN58YdZKqLoXd3RNjC9sV?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
Verify transaction details -  https://explorer.solana.com/tx/2W2AhvUbPfP5euWjQ61h5Hvmwhx2LzbknU5AUEsF5V879g4zxsm1wNP1X2KsRP6dbWvEhiuHu4PJtHnzYyUn2Z1w?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899
    ✔ submits successfully after changing the nonce authority to a pre-signed address (14402ms)


  5 passing (1m)

---