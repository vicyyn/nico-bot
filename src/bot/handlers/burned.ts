import { getBurned } from '../utils'
import { Message } from 'discord.js'

export const burned = async (message: Message) => {
  try {
    let burned = await getBurned()
    message.reply('Total burned amount: ' + burned)
  } catch (e: any) {
    message.reply('something went wrong')
  }
}
