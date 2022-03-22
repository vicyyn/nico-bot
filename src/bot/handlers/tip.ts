import { Keypair, PublicKey } from '@solana/web3.js'
import { getAccountsByOwnerAndMint, transfer, TOKENS } from '../../blockchain'
import type { Message } from 'discord.js'
import { getAmount, getUidFromTag, logger } from '../utils'
import { getUser } from '../../db'

export const tip = async (message: Message, args: string[]) => {
  try {
    const payer = await getUser(message.author.id)
    const tokenAccount1 = await getAccountsByOwnerAndMint(
      payer.getPublicKey(),
      TOKENS['test'].mint,
      payer.getKeyPair()
    )
    const uid = getUidFromTag(args[0])
    const user2 = await getUser(uid)

    const tokenAccount2 = await getAccountsByOwnerAndMint(
      user2.getPublicKey(),
      TOKENS['test'].mint,
      payer.getKeyPair()
    )

    const amount = getAmount(args[1], TOKENS['test'].decimals)
    const tx = await transfer(
      payer.getKeyPair(),
      tokenAccount1[0].pubkey,
      tokenAccount2[0].pubkey,
      amount
    )
    message.reply(tx)
    logger(`TIP ${uid}`, message.author.id)
  } catch (e: any) {
    message.reply('Something went wrong :((')
    logger(`TIP`, message.author.id, true, e)
  }
}

// const _sort = (a: TokenAccount, b: TokenAccount) =>
//   b.account.data.parsed.info.tokenAmount.uiAmount -
//   a.account.data.parsed.info.tokenAmount.uiAmount
