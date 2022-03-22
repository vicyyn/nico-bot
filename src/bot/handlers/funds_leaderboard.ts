import { type Message, MessageEmbed, Client, ClientUser } from 'discord.js'
import { getAllSorted } from '../../db'
import { logger } from '../utils'
import { slice } from 'lodash'
import axios from 'axios'
import { getBearerTokenEnv, getFundsEnv } from '../constants'
import fetch from 'node-fetch'

export const fundsLeaderboard = async (message: Message, client: Client) => {
  try {
    const bearerToken = await getBearerToken()

    const _data = await getFundsLeaderboard(bearerToken)

    console.log(_data)

    logger('FUNDS_LEADERBOARD', message.author.id)
  } catch (e: any) {
    message.reply('Something went wrong :((')
    logger('FUNDS_LEADERBOARD', message.author.id, true, e)
  }
}

//     let data = await getFundsLeaderboard()
//     let entities = data.result_data.map(obj => obj.entity)
//     let balances = data.result_data.map(obj =>
//       commafy(obj.balance_in_usd.toFixed(2))
//     )
//     let eths = data.result_data.map(
//       obj =>
//         ((obj.eth_balance_in_usd / obj.balance_in_usd) * 100).toFixed(2) + '%'
//     )
//     const exampleEmbed = new Discord.MessageEmbed()
//       .setAuthor('Funds Leaderboard')
//       .setColor('#0099ff')
//       .addFields(
//         { name: 'Top 10', value: entities.slice(1, 10), inline: true },
//         { name: 'balance usd', value: balances.slice(1, 10), inline: true },
//         { name: 'eth usd', value: eths.slice(1, 10), inline: true }
//       )

//     await msg.reply(exampleEmbed).then(async messageReaction => {
//       let place = 1
//       messageReaction.react('⬅️')
//       messageReaction.react('➡️')

//       const collector = messageReaction.createReactionCollector(
//         (reaction, user) => {
//           return user.id !== client.user.id && user.id === msg.author.id
//         },
//         { time: 60000 }
//       )
//       collector.on('collect', (reaction, user) => {
//         if (
//           !user.bot &&
//           reaction.emoji.name === '➡️' &&
//           place < data.result_data.length / 10 - 1
//         ) {
//           place++
//           const exampleEmbed2 = new Discord.MessageEmbed()
//             .setAuthor('Funds Leaderboard')
//             .setColor('#0099ff')
//             .addFields(
//               {
//                 name: 'Top ' + ((place - 1) * 10 + 1) + '-' + place * 10,
//                 value: entities.slice((place - 1) * 10, place * 10),
//                 inline: true,
//               },
//               {
//                 name: 'balance usd',
//                 value: balances.slice((place - 1) * 10, place * 10),
//                 inline: true,
//               },
//               {
//                 name: 'eth %',
//                 value: eths.slice((place - 1) * 10, place * 10),
//                 inline: true,
//               }
//             )
//           messageReaction.edit(exampleEmbed2)
//         }
//         if (!user.bot && reaction.emoji.name === '⬅️' && place > 1) {
//           place--
//           const exampleEmbed2 = new Discord.MessageEmbed()
//             .setAuthor('Funds Leaderboard')
//             .setColor('#0099ff')
//             .addFields(
//               {
//                 name:
//                   place === 1
//                     ? 'Top 10'
//                     : 'Top ' + ((place - 1) * 10 + 1) + '-' + place * 10,
//                 value: entities.slice((place - 1) * 10, place * 10),
//                 inline: true,
//               },
//               {
//                 name: 'balance usd',
//                 value: balances.slice((place - 1) * 10, place * 10),
//                 inline: true,
//               },
//               {
//                 name: 'eth %',
//                 value: eths.slice((place - 1) * 10, place * 10),
//                 inline: true,
//               }
//             )
//           messageReaction.edit(exampleEmbed2)
//         }
//         reaction.users.remove(user)
//       })
//     })
//   }

const getFunds = async (authorization: string) => {
  const headers = {
    authority: getFundsEnv.authority,
    'sec-ch-ua':
      '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
    accept: 'application/json, text/plain, */*',
    authorization,
    'sec-ch-ua-mobile': '?0',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    'content-type': 'application/json',
    origin: getFundsEnv.origin,
    'sec-fetch-site': 'cross-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    referer: getFundsEnv.referer,
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  }

  const response = await axios
    .post(
      getFundsEnv.apiUrl,
      {
        params: {
          label: ['Flash Boy', 'Fund', 'Smart LP', 'Smart Money', 'Whale'],
          network: 'ethereum',
        },
        requested_at: 1626976389102,
        accept_stale: true,
      },
      {
        headers,
      }
    )
    .catch(() => ({ data: null }))

  return response.data
}

const getBearerToken = async () => {
  const headers = {
    authority: getBearerTokenEnv.authority,
    origin: getBearerTokenEnv.origin,
    referer: getBearerTokenEnv.referer,
    'sec-ch-ua':
      '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
    'x-client-version': 'Chrome/JsCore/8.0.1/FirebaseCore-web',
    'sec-ch-ua-mobile': '?0',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    'content-type': 'application/json',
    accept: '*/*',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'accept-language': 'en-GB,en;q=0.9',
  }

  const response = await axios
    .post(
      getBearerTokenEnv.apiUrl,
      {
        email: getBearerTokenEnv.email,
        password: getBearerTokenEnv.password,
        returnSecureToken: true,
      },
      {
        headers,
      }
    )
    .catch(() => null)

  if (!response) return ''

  return `Bearer ${response.data.idToken}`
}

async function getFundsLeaderboard(bearer: string) {
  const auth = 'Bearer ' + bearer

  const headers = {
    authority: 'zarya-backend-mediator-pidzqxgs7a-uc.a.run.app',
    'sec-ch-ua':
      '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
    accept: 'application/json, text/plain, */*',
    authorization: auth,
    'sec-ch-ua-mobile': '?0',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    'content-type': 'application/json',
    origin: 'https://pro.nansen.ai',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    referer: 'https://pro.nansen.ai/',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  }

  const data =
    '{"params":{"label":["Flash Boy","Fund","Smart LP","Smart Money","Whale"],"network":"ethereum"},"requested_at":1626976389102,"accept_stale":true}'
  return await fetch(
    'https://zarya-backend-mediator-pidzqxgs7a-uc.a.run.app/v1/questions/sm_funds_leaderboard',
    {
      method: 'POST',
      headers: headers,
      body: data,
    }
  )
    .then(res => res.json())
    .then(data => data)
}
