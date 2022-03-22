import type { Message } from 'discord.js'
import { getBalanceFromAccount } from '../utils'
import { getAccountsByOwnerAndMint } from '../../blockchain'
import { PublicKey } from '@solana/web3.js'
import { logger } from '../utils'
import { getUser } from '../../db'

export const balance = async (message: Message) => {
  try {
    const address = await getUser(message.author.id)

    const token = await getAccountsByOwnerAndMint(
      new PublicKey(address.publicKey),
      new PublicKey('AcAwCGb4AH32CgnqLqynuZTq1xKVZwjppVGk3rSTnkF7'),
      address.getKeyPair()
    )

    const balances = getBalanceFromAccount(token)
    message.reply(
      balances.reduce(
        (acc, balance) =>
          `${acc}\n${balance.pubkey.toBase58()} balance: ${
            balance.balance
          } COPE`,
        ''
      )
    )
    logger('BALANCE', message.author.id)
  } catch (e: any) {
    if (e.code === 'UNREGISTED_USER') message.reply(e.message)
    else message.reply('Something went wrong :((')
    logger('ADDRESS', message.author.id, true, e)
  }
}
