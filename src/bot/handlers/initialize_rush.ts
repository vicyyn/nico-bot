import type { Client, Message, TextChannel } from 'discord.js'
import { getUser } from '../../db'
import { initializeRush as initializeRushTransaction, PYTH, deposit, endRush, CONNECTION, cancelDeposit, claim, TOKENS, getAccountsByOwnerAndMint } from '../../blockchain'
import { Keypair } from '@solana/web3.js'
import { logger } from '../utils'
import { MessageEmbed } from 'discord.js'
import { parsePriceData, PriceData } from '@pythnetwork/client'

export const bold = (text: string) => {
	return '**' + text + '**'
}

export const yaml = (text: string) => {
	return '```yaml\n' + text + '```'
}

export const blue = (text: string) => {
	return '```md\n#' + text + '```'
}

export const code = (text: string) => {
	return '```' + text + '```'
}

export const mentionFromId = (id: string) => {
	return '<@' + id + '>'
}

export const createEmbed = (asset: string, _depositTimeLeft: number, _poolTimeLeft: number, initial: PriceData, pool: string, poolState?: any, data?: PriceData, winnerSide?: "UP" | "DOWN", toClaim?: boolean): MessageEmbed => {
	const currentPrice = data ? data.price?.toFixed(2) : initial.price?.toFixed(2)
	const upAmount = poolState === undefined ? 0 : poolState.upAmount
	const downAmount = poolState === undefined ? 0 : poolState.downAmount
	const ended = poolState === undefined ? false : poolState.ended
	const endPrice = ended === false ? currentPrice : poolState.endPrice

	const depositTimeLeft = _depositTimeLeft === 0 ? "FINISHED" : _depositTimeLeft + " SECONDS"
	const poolTimeLeft = _poolTimeLeft === 0 ? "FINISHED" : _poolTimeLeft + " SECONDS"
	const claim = toClaim ? yaml("TO CLAIM : ? claim " + pool) : yaml("")


	return new MessageEmbed()
		.setTitle("🚀 Rush Pool Started")
		.setColor("#68BB59")
		.setDescription(bold("Ethereum Pool Initialized")
			+ "\nUsers deposit and predict the price will be higher or lower. Winning side divide the amount submited by the lost side"
			+ blue("POOL ADDRESS: " + pool)
			+ yaml("ASSET: " + asset)
			+ yaml("INITIAL PRICE: " + initial.price?.toFixed(2))
			+ yaml("CURRENT/END PRICE: " + endPrice)
			+ yaml("DEPOSIT TIME LEFT: " + depositTimeLeft)
			+ yaml("POOL ENDS IN: " + poolTimeLeft)
			+ yaml("DEPOSITED UP: " + upAmount)
			+ yaml("DEPOSITED DOWN: " + downAmount)
		)
		//+ winnerSide !== undefined ? yaml("WINNER SIDE : " + winnerSide) : "")
		.setFooter({ text: "Pool will last for a limited time" })
}

export const initializeRush = async (message: Message, client: Client, args: string[]) => {
	try {
		const payer = await getUser(message.author.id)
		const pool = new Keypair()
		let depositTimeLeft = Number(args[0])
		let poolTimeLeft = Number(args[1])
		const [i_tx, vault, program] = await initializeRushTransaction(depositTimeLeft, poolTimeLeft, payer.getKeyPair(), pool, PYTH, TOKENS["cope"].mint)
		let data: PriceData
		let poolState: any
		if (program) {
			program.account.pool.subscribe(pool.publicKey).on("change", state => {
				poolState = state;
			})
		}
		const account = await CONNECTION.getAccountInfo(PYTH)
		if (!account) {
			return "error"
		}
		const initial = parsePriceData(account.data)
		const initialEmbed = createEmbed("ETHEREUM", depositTimeLeft, poolTimeLeft, initial, pool.publicKey.toBase58())
		CONNECTION.onAccountChange(PYTH, (account) => {
			data = parsePriceData(account.data)
		})

		const rush_pools_channel = message.guild?.channels.cache.find(i => i.name === 'rush-pools') as TextChannel
		const rush_pools_transactions_channel = message.guild?.channels.cache.find(i => i.name === 'rush-pools-transactions') as TextChannel

		if (!rush_pools_channel) {
			// await message.guild?.channels.create("rush-pools", { reason: 'Needed a cool new channel' })
		}
		if (!rush_pools_transactions_channel) {
			// await message.guild?.channels.create("rush-pools-transactions", { reason: 'Needed a cool new channel' })
		}
		rush_pools_transactions_channel.send(code("Pool Initialized : " + i_tx))

		await rush_pools_channel.send({ embeds: [initialEmbed] }).then(async messageReaction => {
			let once = true
			const timer = setInterval(async function () {
				if (poolTimeLeft <= 0) {
					if (once) {
						try {
							once = false;
							const e_tx = await endRush(payer.getKeyPair(), PYTH, pool);
							const embed = createEmbed("ETHEREUM", depositTimeLeft, poolTimeLeft, initial, pool.publicKey.toBase58(), poolState, data)
							messageReaction.edit({ embeds: [embed] })

							rush_pools_transactions_channel.send(code("Pool Ended : " + e_tx))
							logger("END POOL", message.author.id)
							clearInterval(timer)
						} catch (err) {
							once = true
							logger("END POOL", message.author.id, true, err)
						}
					}
					return
				} else if (depositTimeLeft <= 0) {
					poolTimeLeft--
				} else {
					poolTimeLeft--
					depositTimeLeft--
				}
				const embed = createEmbed("ETHEREUM", depositTimeLeft, poolTimeLeft, initial, pool.publicKey.toBase58(), poolState, data)
				messageReaction.edit({ embeds: [embed] })
			}, 1000);

			messageReaction.react("⬆️")
			messageReaction.react("⬇️")

			messageReaction.react("🚫")
			messageReaction.react("💰")

			const collector = messageReaction.createReactionCollector(
				{
					filter: (messageReaction, user) => { return user.id != client.user?.id },
					time: poolTimeLeft * 1000 + 600000
				}
			);

			collector.on("collect", async (reaction, user) => {
				if (reaction.emoji.name === "💰") {
					try {
						const taker_private = await getUser(user.id)
						const userTokenAccount = await getAccountsByOwnerAndMint(taker_private.getPublicKey(), TOKENS["cope"].mint, taker_private.getKeyPair()).then((res) => res[0].pubkey)
						const d_tx = await claim(taker_private.getKeyPair(), PYTH, vault, userTokenAccount, pool);

						rush_pools_transactions_channel.send(mentionFromId(user.id) + code("User Claim : " + d_tx))
						logger("CLAIM", message.author.id)
					} catch (err) {
						rush_pools_transactions_channel.send(mentionFromId(user.id) + code("User Claim : " + "ERROR"))
						logger("CLAIM", message.author.id, true, err)
					}
				}
				if (reaction.emoji.name === "⬆️") {
					try {
						const taker_private = await getUser(user.id)
						const userTokenAccount = await getAccountsByOwnerAndMint(taker_private.getPublicKey(), TOKENS["cope"].mint, taker_private.getKeyPair()).then((res) => res[0].pubkey)
						const d_tx = await deposit("up", 1 * 10 ** TOKENS["cope"].decimals, taker_private.getKeyPair(), userTokenAccount, vault, pool);

						rush_pools_transactions_channel.send(mentionFromId(user.id) + code("User Deposited Up : 1000 " + d_tx))
						logger("DEPOSITED UP", message.author.id)
					} catch (err) {
						rush_pools_transactions_channel.send(mentionFromId(user.id) + code("User Deposited Up : 1000 " + "ERROR"))
						logger("DEPOSITED UP", message.author.id, true, err)
					}
				}
				if (reaction.emoji.name === "⬇️") {
					try {
						const taker_private = await getUser(user.id)
						const userTokenAccount = await getAccountsByOwnerAndMint(taker_private.getPublicKey(), TOKENS["cope"].mint, taker_private.getKeyPair()).then((res) => res[0].pubkey)
						const d_tx = await deposit("down", 1 * 10 ** TOKENS["cope"].decimals, taker_private.getKeyPair(), userTokenAccount, vault, pool);

						rush_pools_transactions_channel.send(mentionFromId(user.id) + code("User Deposited Down : 1000 " + d_tx))
						logger("DEPOSITED DOWN", message.author.id)
					} catch (err) {
						rush_pools_transactions_channel.send(mentionFromId(user.id) + code("User Deposited Down : 1000 " + "ERROR"))
						logger("DEPOSITED DOWN", message.author.id, true, err)
					}
				}
				if (reaction.emoji.name === "🚫") {
					try {
						const taker_private = await getUser(user.id)
						const userTokenAccount = await getAccountsByOwnerAndMint(taker_private.getPublicKey(), TOKENS["cope"].mint, taker_private.getKeyPair()).then((res) => res[0].pubkey)
						const d_tx = await cancelDeposit(taker_private.getKeyPair(), vault, userTokenAccount, pool);

						rush_pools_transactions_channel.send(mentionFromId(user.id) + code("User Cancel Deposit " + d_tx))
						logger("CANCEL DEPOSIT", message.author.id)
					} catch (err) {
						rush_pools_transactions_channel.send(mentionFromId(user.id) + code("User Cancel Deposit " + "ERROR"))
						logger("CANCEL DEPOSIT", message.author.id, true, err)
					}
				}

				reaction.users.remove(user);
			});

		})

	} catch (e: any) {
		message.reply("something went wrong")
		logger("POOL INITIALIZED", message.author.id, true, e)
	}
}
