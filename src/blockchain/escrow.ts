import type { PublicKey, Keypair } from '@solana/web3.js'
import { BN } from '@project-serum/anchor'
import { createProgram } from './utils'
import {
  ESCROW_PDA,
  ESCROW_IDL,
  ESCROW_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  SYSVAR_RENT_PUBKEY,
} from './constants'

export const initializeEscrow = async (
  payer: Keypair,
  amount1: number,
  amount2: number,
  escrowAccount: Keypair,
  give: PublicKey,
  ask: PublicKey
): Promise<string> => {
  try {
    const program = createProgram(payer, ESCROW_PROGRAM_ID, ESCROW_IDL)

    let initialize_escrow_transaction = await program.rpc.initializeEscrow(
      new BN(amount1),
      new BN(amount2),
      {
        accounts: {
          initializer: program.provider.wallet.publicKey,
          initializerDepositTokenAccount: give,
          initializerReceiveTokenAccount: ask,
          escrowAccount: escrowAccount.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [
          await program.account.escrowAccount.createInstruction(escrowAccount),
        ],
        signers: [escrowAccount],
      }
    )

    return initialize_escrow_transaction
  } catch (e) {
    console.log(e)
    return 'error'
  }
}

export const cancelEscrow = async (
  payer: Keypair,
  pdaTokenAccount: PublicKey,
  escrowAccount: PublicKey
): Promise<string> => {
  try {
    const program = createProgram(payer, ESCROW_PROGRAM_ID, ESCROW_IDL)

    let cancel_escrow_transaction = await program.rpc.cancelEscrow({
      accounts: {
        initializer: program.provider.wallet.publicKey,
        pdaDepositTokenAccount: pdaTokenAccount,
        pdaAccount: ESCROW_PDA,
        escrowAccount: escrowAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    })
    return cancel_escrow_transaction
  } catch (e) {
    return 'error'
  }
}

export const exchange = async (
  payer: Keypair,
  give: PublicKey,
  ask: PublicKey,
  pdaTokenAccount: PublicKey,
  escrowAccount: PublicKey,
  initializer: PublicKey,
  initAsk: PublicKey
): Promise<string> => {
  try {
    const program = createProgram(payer, ESCROW_PROGRAM_ID, ESCROW_IDL)

    let exchange_transaction = await program.rpc.exchange({
      accounts: {
        taker: program.provider.wallet.publicKey,
        takerDepositTokenAccount: give,
        takerReceiveTokenAccount: ask,
        pdaDepositTokenAccount: pdaTokenAccount,
        initializerReceiveTokenAccount: initAsk,
        initializerMainAccount: initializer,
        escrowAccount: escrowAccount,
        pdaAccount: ESCROW_PDA,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    })
    return exchange_transaction
  } catch (e) {
    return 'error'
  }
}
