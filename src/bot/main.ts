import * as constants from '../constants'
import type { Client, Message } from 'discord.js'
import { getArgs } from './utils'

import * as handlers from './handlers'

const handleMessage = async (message: Message, client: Client) => {
  if (message.channel.type === 'DM' && !message.author.bot) {
    // register a new public key
    await handlers.dm(message)
    return
  }

  if (!message.content.startsWith(constants.prefix)) return
  if (message.author.bot) return

  const [command, ...args] = getArgs(message.content)

  switch (command) {
    case 'help':
      handlers.handleHelp(message)
      break

    case 'connect':
      handlers.connect(message)
      break

    case 'address':
      handlers.address(message)
      break

    case 'balance':
      handlers.balance(message)
      break

    case 'burned':
      handlers.burned(message)
      break

    case 'contribute':
      handlers.contribute(message, args)
      break

    case 'leaderboard':
      handlers.leaderboard(message, client)
      break

    case 'burn':
      handlers.burn(message, args)
      break

    case 'tip':
      handlers.tip(message, args)
      break

    case 'airdrop':
      handlers.airdrop(message)
      break

    case 'funds-leaderboard':
      handlers.fundsLeaderboard(message, client)
      break

    case 'sm_stablecoins':
      handlers.sm_stablecoins()
      break

    case 'hotContracts':
      handlers.hotContracts()
      break

    case 'escrow':
      handlers.escrow(message, client, args)
      break

    case 'stats':
      handlers.stats(message, client)
      break

    case 'nftdata':
      handlers.nftdata()
      break

    case 'p':
    case 'price':
      handlers.price(message, args)
      break

    case 'initialize-rush':
      handlers.initializeRush(message, client, args)
      break
  }
}

export default handleMessage
