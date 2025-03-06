# To successfully run the upgraded app do:
- anchor build
- anchor keys sync
- anchor test

# You can do also anchor test, which possibly will fail with '
     Error: AnchorError occurred. Error Code: DeclaredProgramIdMismatch. Error Number: 4100. Error Message: The declared program id does not match the actual program id.
      at Function.parse (node_modules/@coral-xyz/anchor/src/error.ts:136:14)
      at translateError (node_modules/@coral-xyz/anchor/src/error.ts:277:35)
      at MethodsBuilder.rpc [as _rpcFn] (node_modules/@coral-xyz/anchor/src/program/namespace/rpc.ts:35:29)
      at processTicksAndRejections (node:internal/process/task_queues:105:5)
'
The solution is to run 'anchor keys sync' (after 'anchor build' fails) to update the program id everywhere, and then to run 'anchor test'
The link https://solana.stackexchange.com/questions/5570/error-the-declared-program-id-does-not-match-the-actual-program-id
explained the problem but also can teach how to list the program pub key and check the program balance. Also, how to manually deploy program and idl files to given network.


