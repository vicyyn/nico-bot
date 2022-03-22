import { PublicKey, Keypair } from '@solana/web3.js';
import { createProgram, createProgramAddress } from './utils';
import { DEFAULT_PUBKEY, RUSH_IDL, RUSH_PROGRAM_ID, SYSTEM_PROGRAM, SYSVAR_CLOCK_PUBKEY, TOKENS, TOKEN_PROGRAM_ID, SYSVAR_RENT_PUBKEY, CONNECTION } from './constants';
import { BN, Program } from '@project-serum/anchor'

export const initializeRush = async (depositTimeLeft: number, poolTimeLeft: number, payer: Keypair, pool: Keypair, pyth: PublicKey, mint: PublicKey): Promise<[string, PublicKey, Program | undefined]> => {
	const program = createProgram(payer, RUSH_PROGRAM_ID, RUSH_IDL);

	const [vault, nonce] = await createProgramAddress(program, [mint]);

	const initialize_rush_transaction = await program.rpc.createPool(new BN(depositTimeLeft), new BN(poolTimeLeft), new BN(nonce), {
		accounts: {
			pool: pool.publicKey,
			vault,
			mint,
			pyth,
			authority: program.provider.wallet.publicKey,
			systemProgram: SYSTEM_PROGRAM,
			tokenProgram: TOKEN_PROGRAM_ID,
			clock: SYSVAR_CLOCK_PUBKEY,
			rent: SYSVAR_RENT_PUBKEY,
		},
		signers: [pool]
	})

	return [initialize_rush_transaction, vault, program]
}

export const deposit = async (position: "up" | "down", amount: number, payer: Keypair, userTokenAccount: PublicKey, vault: PublicKey, pool: Keypair): Promise<string> => {
	const program = createProgram(payer, RUSH_PROGRAM_ID, RUSH_IDL);

	let [userDeposit, nonce] = await createProgramAddress(program, [pool.publicKey, program.provider.wallet.publicKey])

	const positionBool = position === "up" ? true : false

	const deposit_transaction = await program.rpc.deposit(new BN(amount), new BN(nonce), positionBool, {
		accounts: {
			pool: pool.publicKey,
			vault: vault,
			authority: program.provider.wallet.publicKey,
			userDeposit: userDeposit,
			tokenProgram: TOKEN_PROGRAM_ID,
			userTokenAccount: userTokenAccount,
			clock: SYSVAR_CLOCK_PUBKEY,
			systemProgram: SYSTEM_PROGRAM,
		},
	});

	return deposit_transaction
}

export const endRush = async (payer: Keypair, pyth: PublicKey, pool: Keypair): Promise<string> => {
	const program = createProgram(payer, RUSH_PROGRAM_ID, RUSH_IDL);

	const end_rush_transaction = await program.rpc.endPool({
		accounts: {
			pool: pool.publicKey,
			authority: program.provider.wallet.publicKey,
			pyth,
			clock: SYSVAR_CLOCK_PUBKEY,
			systemProgram: SYSTEM_PROGRAM,
		},
	});
	return end_rush_transaction
}

export const cancelDeposit = async (payer: Keypair, vault: PublicKey, userTokenAccount: PublicKey, pool: Keypair): Promise<string> => {
	const program = createProgram(payer, RUSH_PROGRAM_ID, RUSH_IDL);
	let [userDeposit, nonce] = await createProgramAddress(program, [pool.publicKey, program.provider.wallet.publicKey])

	const cancel_deposit_transaction = await program.rpc.cancelDeposit({
		accounts: {
			pool: pool.publicKey,
			vault: vault,
			authority: program.provider.wallet.publicKey,
			userDeposit: userDeposit,
			tokenProgram: TOKEN_PROGRAM_ID,
			userTokenAccount: userTokenAccount,
			clock: SYSVAR_CLOCK_PUBKEY,
			systemProgram: SYSTEM_PROGRAM
		},
	});

	return cancel_deposit_transaction
}

export const claim = async (payer: Keypair, pyth: PublicKey, vault: PublicKey, userTokenAccount: PublicKey, pool: Keypair): Promise<string> => {
	const program = createProgram(payer, RUSH_PROGRAM_ID, RUSH_IDL);
	let [userDeposit, nonce] = await createProgramAddress(program, [pool.publicKey, program.provider.wallet.publicKey])


	const tx = await program.rpc.claim({
		accounts: {
			pool: pool.publicKey,
			vault: vault,
			authority: program.provider.wallet.publicKey,
			userDeposit: userDeposit,
			tokenProgram: TOKEN_PROGRAM_ID,
			userTokenAccount: userTokenAccount,
			systemProgram: SYSTEM_PROGRAM
		},
	});

	return tx
}
