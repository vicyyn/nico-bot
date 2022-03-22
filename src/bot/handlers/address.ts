import type { Message } from 'discord.js'
import { logger } from '../utils'
import { getUser } from '../../db'

export const address = async (message: Message) => {
  try {
    const address = await getUser(message.author.id)
    message.reply('Your address is ' + address.publicKey)
    logger('ADDRESS', message.author.id)
  } catch (e: any) {
    if (e.code === 'UNREGISTED_USER') message.reply(e.message)
    else message.reply('Something went wrong :((')
    logger('ADDRESS', message.author.id, true, e)
  }
}
