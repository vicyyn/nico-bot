import { Token } from '@solana/spl-token'
import {
	AccountInfo,
	Keypair,
	ParsedAccountData,
	PublicKey,
	Transaction,
} from '@solana/web3.js'
import { TokenAccount } from '../bot/utils'
import { CONNECTION, TOKENS, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from './constants'

export async function transfer(
  payer: Keypair,
  source: PublicKey,
  destination: PublicKey,
  amount: number
): Promise<string> {
  const token = new Token(
    CONNECTION,
    TOKENS['cope'].mint,
    TOKEN_PROGRAM_ID,
    payer
  )
  let tx = await token.transfer(source, destination, payer, [], amount)
  return tx
}

export async function getBalance(address: PublicKey): Promise<number> {
  let res = await CONNECTION.getTokenAccountBalance(address)
  let amount = res.value.uiAmount
  if (amount == null) {
    throw new Error('Balance is Null')
  }
  return amount
}

export async function getAccountsByOwnerAndMint(
	owner: PublicKey,
	mint: PublicKey,
	feePayer: Keypair,
	createIfEmpty?: boolean,
): Promise<
	TokenAccount[]
> {

	let ata: PublicKey
	let accounts: TokenAccount[]
	accounts = await CONNECTION.getParsedTokenAccountsByOwner(owner, { mint }).then((res) => res.value)

	if (accounts.length === 0 && createIfEmpty) {
		ata = await Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			mint,
			owner,
		);
		const tx = await createAssociatedTokenAccount(mint, owner, ata, feePayer)

		let a = await CONNECTION.getParsedAccountInfo(ata)
		if (a === null) throw "ERROR"
		accounts = [{ pubkey: ata, account: a.value as AccountInfo<ParsedAccountData> }]
	}

	return accounts
}

export const createAssociatedTokenAccount = async (mint: PublicKey, owner: PublicKey, ata: PublicKey, feePayer: Keypair): Promise<string> => {
	const instruction = Token.createAssociatedTokenAccountInstruction(
		ASSOCIATED_TOKEN_PROGRAM_ID,
		TOKEN_PROGRAM_ID,
		mint,
		ata,
		owner,
		feePayer.publicKey
	)
	const tx = await CONNECTION.sendTransaction(new Transaction().add(instruction), [feePayer], { "preflightCommitment": "finalized" });

	return tx

}
