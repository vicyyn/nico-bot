import type { Message } from 'discord.js'
import { logger } from '../utils'

export const connect = async (message: Message) => {
  try {
    message.reply('Please follow the steps in the private DM')
    await message.author.send('https://imgur.com/m0HYi77.jpg')
    logger('CONNECT', message.author.id)
  } catch (e: any) {
    message.reply('something went wrong')
    logger('CONNECT', message.author.id, true, e)
  }
}
