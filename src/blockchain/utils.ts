import { Keypair, PublicKey } from '@solana/web3.js'
import { Program, Provider, Idl } from '@project-serum/anchor'
import { CONNECTION } from './constants'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'

export const createProgram = (
  payer: Keypair,
  programId: PublicKey,
  idl: Idl
): Program => {
  const wallet = new NodeWallet(payer)
  const provider = new Provider(CONNECTION, wallet, Provider.defaultOptions())
  const program = new Program(idl, programId, provider)
  return program
}

export const createProgramAddress = async (program: Program, accounts: PublicKey[]): Promise<[PublicKey, number]> => {
	const [address, nonce] = await PublicKey.findProgramAddress(
		accounts.map((value) => value.toBuffer()),
		program.programId
	);
	return [address, nonce]
}

export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
