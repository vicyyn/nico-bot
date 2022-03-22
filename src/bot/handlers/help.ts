import type { Message } from 'discord.js'
import { formattedHelp } from '../utils'
import commands from '../commands'

// TODO: Change Commands
export const handleHelp = (message: Message, command?: string) => {
  try {
    message.reply(
      formattedHelp()
        .to('connect your wallet', 'connect')
        .to('tip', 'tip @user <amount>')
        .to('check your address', 'addy')
        .to('check your balance', 'balance')
        .to('check the leaderboard', 'leaderboard')
        .to('burn', 'burn <amount>')
        .to('airdrop', 'airdrop <number of people> <amount to each>')
        .to('check total burned', 'burned')
        .to('contribute to the bot', 'contribute <amount>')
        .end()
    )
  } catch (e: any) {
    message.reply('something went wrong')
  }
}
