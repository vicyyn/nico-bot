import { CoinGeckoClient } from '../constants'
import { Message } from 'discord.js'

export const price = async (message: Message, args: string[]) => {
  try {
    const coins = await CoinGeckoClient.simple.price({
      ids: [args[0]],
      vs_currencies: ['usd'],
    })
    message.reply('price : ' + coins.data[args[0]]['usd'])
  } catch (e: any) {
    message.reply('something went wrong')
  }
}
