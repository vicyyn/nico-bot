import { SystemProgram, Connection, PublicKey } from '@solana/web3.js'
import _escrow_idl from '../idl/escrow.json'
import _rush_idl from '../idl/rush.json'
import type { Idl } from '@project-serum/anchor'

export const ESCROW_PDA = new PublicKey('D7os82ezGvhPBd8o2yKrRh8dNNShgpeGgH7K6StXiEL1')
export const CONNECTION = new Connection('https://api.devnet.solana.com', "finalized")
export const ESCROW_PROGRAM_ID = new PublicKey(_escrow_idl.metadata.address)
export const RUSH_PROGRAM_ID = new PublicKey(_rush_idl.metadata.address)
export const RUSH_IDL = _rush_idl as Idl
export const ESCROW_IDL = _escrow_idl as Idl
export const SYSTEM_PROGRAM = SystemProgram.programId
export const PYTH = new PublicKey(
  'EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw'
)
export const DEFAULT_PUBKEY = PublicKey.default
// export const VAULT = new PublicKey("")

export { SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY, LAMPORTS_PER_SOL } from '@solana/web3.js'
export { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'

export const TOKENS = {
  cope: {
    mint: new PublicKey('3Qzh8yXvaTqsDPLh6uwcmf5gEZNNABfEtdedguFGuZwr'),
    decimals: 6,
  },
  usdc: {
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    decimals: 6,
  },
  test: {
    mint: new PublicKey('3iapZrNKkZ3NF9YYebgm6TGEGT3L8QY9pcWCkEKBK4oi'),
    decimals: 2,
  },
}
