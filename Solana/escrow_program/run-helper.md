# To successfully run the upgraded app do:
- anchor build
- anchor keys sync
- anchor test

# You can do also 'anchor test', which possibly will fail with '
     Error: AnchorError occurred. Error Code: DeclaredProgramIdMismatch. Error Number: 4100. Error Message: The declared program id does not match the actual program id.
      at Function.parse (node_modules/@coral-xyz/anchor/src/error.ts:136:14)
      at translateError (node_modules/@coral-xyz/anchor/src/error.ts:277:35)
      at MethodsBuilder.rpc [as _rpcFn] (node_modules/@coral-xyz/anchor/src/program/namespace/rpc.ts:35:29)
      at processTicksAndRejections (node:internal/process/task_queues:105:5)
'

# The sequence that work for me:
- Sequence:  Run 'anchor clean' first. the clean was followed by 'anchor test', which triggered the build and test failed. 'anchor keys sync' was next, and finally 'anchor test' was rerun.

# The sequences that did not work for me:
- Sequence#1: Run 'anchor buld', 'solana-test-validator' run in another shell, 'anchor deploy' against the test validator from the first shell, stop the test validator, run 'anchor test'.
- Sequence#2: Run 'anchor buld', 'solana-test-validator' run in another shell, 'anchor deploy' against the test validator from the first shell, run 'anchor test --skip-local-validator'.

# More information
The solution is to run 'anchor keys sync' (after 'anchor build' fails) to update the program id everywhere, and then to run 'anchor test'
The link https://solana.stackexchange.com/questions/5570/error-the-declared-program-id-does-not-match-the-actual-program-id
explained the problem but also can teach how to list the program pub key and check the program balance. Also, how to manually deploy program and idl files to given network.

Note that solana-test-validator is not run neither in this shell, nor in any other shells prior 'anchor test' to run!!!
