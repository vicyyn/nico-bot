import { Client, Intents } from 'discord.js'
import { discordToken } from '../constants'
import handleMessage from './main'

const run = async () => {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ['CHANNEL'],
  })

  client.once('ready', () => {
    console.log('Discord bot is Ready!')
    client.user?.setActivity('tips | made by @vicyyn', { type: 'WATCHING' })
  })

  client.on('messageCreate', message => handleMessage(message, client))

  return client.login(discordToken)
}

export default run
