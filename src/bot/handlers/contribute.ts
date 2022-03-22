import { getAccountsByOwnerAndMint, transfer, TOKENS } from '../../blockchain'
import type { Message } from 'discord.js'
import { getAmount, logger } from '../utils'
import { TIP_JAR } from '../constants'
import { getUser } from '../../db'

export const contribute = async (message: Message, args: string[]) => {
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
      TIP_JAR,
      amount
    )
    message.reply(tx)
    logger('CONTRIBUTE', message.author.id)
  } catch (e: any) {
    if (e.code === 'UNREGISTED_USER') message.reply(e.message)
    message.reply('Something went wrong :((')
    logger('CONTRIBUTE', message.author.id, true, e)
  }
}
