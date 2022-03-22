import { Keypair } from '@solana/web3.js'
import type { Message } from 'discord.js'
import { logger } from '../utils'
import * as service from '../../db'
import { UserRegistrationException } from '../../errors'

export const dm = async (message: Message) => {
  try {
    console.log(message.author)

    const user = await service.getUserOrNull(message.author.id)
    if (user) throw new UserRegistrationException()
    const array = JSON.parse(message.content)
    const owner = Keypair.fromSecretKey(new Uint8Array(array))
    await service.create(
      message.author.id,
      array,
      owner.publicKey.toBase58(),
      message.author.username
    )
    await message.reply('You are registered successfully')
    logger('DM', message.author.id)
  } catch (e: any) {
    if (e.code === 'REGISTED_USER') message.reply(e.message)
    else message.reply('something went wrong')
    logger('DM', message.author.id, true, e)
  }
}
