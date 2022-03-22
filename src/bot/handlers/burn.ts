import { getAccountsByOwnerAndMint, transfer, TOKENS } from '../../blockchain'
import type { Message } from 'discord.js'
import { getAmount, getUidFromTag } from '../utils'
import { BURN_JAR } from '../constants'
import { getUser } from '../../db'
export const burn = async (message: Message, args: string[]) => {
  try {
    const payer = await getUser(message.author.id)
    const tokenAccount1 = await getAccountsByOwnerAndMint(
      payer.getPublicKey(),
      TOKENS['test'].mint,
      payer.getKeyPair()
    )
    const amount = getAmount(args[0], TOKENS['test'].decimals)
    const tx = await transfer(
      payer.getKeyPair(),
      tokenAccount1[0].pubkey,
      BURN_JAR,
      amount
    )
    message.reply(tx)
  } catch (e: any) {
    message.reply('Something went wrong :((')
  }
}
