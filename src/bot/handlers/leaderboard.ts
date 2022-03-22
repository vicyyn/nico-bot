import { type Message, MessageEmbed, Client, ClientUser } from 'discord.js'
import { getAllSorted } from '../../db'
import { logger } from '../utils'
import { slice } from 'lodash'

export const leaderboard = async (message: Message, client: Client) => {
  try {
    const data = await getAllSorted(0, 20)

    const names = data.map(d => d.username)
    const burns = data
      .map(d => d.burned)
      .map(burned => Number(burned).toFixed(2))

    const pageLimit = 5
    let page = 0

    const embed = createEmbed(page, pageLimit, { names, burns })

    if (embed) {
      const embedMessage = await message.reply({ embeds: [embed] })

      embedMessage.react('⬅️')
      embedMessage.react('➡️')

      const collector = embedMessage.createReactionCollector({
        filter: (messageReaction, user) => {
          return user.id != (client.user as ClientUser).id
        },
        time: 60000,
      })

      collector.on('collect', (reaction, user) => {
        if (
          reaction.emoji.name === '➡️' &&
          page < Math.ceil(data.length / pageLimit) - 1
        ) {
          const _embed = createEmbed(++page, pageLimit, { names, burns })
          if (_embed)
            embedMessage.edit({
              embeds: [_embed],
            })
        }

        if (reaction.emoji.name === '⬅️' && page > 0) {
          const _embed = createEmbed(--page, pageLimit, { names, burns })
          if (_embed)
            embedMessage.edit({
              embeds: [_embed],
            })
        }
        reaction.users.remove(user)
      })
    }

    logger('LEADERBOARD', message.author.id)
  } catch (e: any) {
    message.reply('Something went wrong :((')
    logger('LEADERBOARD', message.author.id, true, e)
  }
}

const createEmbed = (page: number, pageLimit: number, data: any) => {
  const names = slice(
    data.names,
    page * pageLimit,
    page * pageLimit + pageLimit
  ).map((name, idx) => `${page * pageLimit + idx + 1} - ${name}`)

  const burns = slice(
    data.burns,
    page * pageLimit,
    page * pageLimit + pageLimit
  )

  if (names.length === 0 || burns.length === 0) return null

  return new MessageEmbed()
    .setTitle('COPE Burn Leaderboard')
    .setColor('#0099ff')
    .addField(`Top ${pageLimit}`, names.join('\n'), true)
    .addField('Burned', burns.join('\n'), true)
}
