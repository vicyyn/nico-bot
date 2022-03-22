import type { Message } from 'discord.js'
import { logger } from '../utils'

export const airdrop = async (message: Message) => {
  try {
    logger('ADDRESS', message.author.id)
  } catch (e: any) {
    message.reply('Something went wrong :((')
    logger('ADDRESS', message.author.id, true, e)
  }
}

// if (
//     args[0] == 'airdrop' &&
//     args[1] &&
//     args[2] &&
//     !args[3] &&
//     msg.channel.type != 'dm'
//   ) {
//     fs.readFile('output', 'utf8', async (err, data) => {
//       if (err) {
//         console.error(err)
//         return
//       }
//       if (
//         parseFloat(args[1].replace(',', '.')) < 5 ||
//         parseFloat(args[1].replace(',', '.')) > 40
//       ) {
//         msg.reply('Number of people has to be between 5 to 40')
//         return
//       }
//       if (parseFloat(args[2].replace(',', '.')) < 1) {
//         msg.reply('Cope Amount has to be bigger or equal than 1')
//         return
//       }
//       var json
//       var tipper
//       var tipperaddress
//       args[1] = parseInt(args[1].replace(',', '.'))
//       args[2] = parseFloat(args[2].replace(',', '.'))
//       if (isNaN(args[1])) {
//         msg.reply('Please provide a valid number')
//         return
//       }
//       if (isNaN(args[2])) {
//         msg.reply('Please provide a valid number')
//         return
//       }
//       try {
//         json = JSON.parse(data)
//       } catch (err) {
//         msg.reply('Error while fetching, Please try again')
//         return
//       }
//       try {
//         tipper = json[msg.author.id].private
//         tipperaddress = new Account(tipper).publicKey.toBase58()
//       } catch (err) {
//         msg.reply("Tipper doesn't have a wallet connected")
//         return
//       }

//       let array = Object.keys(json).map(key => {
//         if (json[key].hasOwnProperty('burned') && json[key].burned > 10) {
//           return {
//             key: key,
//             private: json[key].private,
//             burned: json[key].burned,
//           }
//         }
//       })
//       array = array.filter(value => value != undefined)
//       array = getRandom(array, args[1])

//       let receipts = []
//       let winners = []
//       for (const value of array) {
//         let receiveraddress
//         let receivertokenaddress
//         let tippertokenaddress

//         try {
//           receiveraddress = new Account(value.private).publicKey.toBase58()
//         } catch (e) {
//           msg.reply(
//             'Something went wrong with the Cope token account (Please make sure the receiver have a COPE address available)'
//           )
//         }
//         receivertokenaddress = await getTokenAccountsByOwner(receiveraddress)
//         if (!receivertokenaddress) {
//           msg.reply(
//             'Something went wrong with the Cope token account (Please make sure the receiver have a COPE address available)'
//           )
//           return
//         }
//         tippertokenaddress = await getTokenAccountsByOwner(tipperaddress)
//         if (!tippertokenaddress) {
//           msg.reply(
//             'Something went wrong with the Cope token account (Please make sure you have a COPE address available)'
//           )
//           return
//         }
//         let tx = await transfer(
//           args[2],
//           receivertokenaddress,
//           tippertokenaddress,
//           tipperaddress,
//           tipper
//         )
//         if (tx) {
//           let member = await msg.guild.members.fetch(value.key)
//           receipts.push('```' + member.user.username + ' : ' + tx + '```')
//           winners.push(member.user.username)
//         } else {
//           let member = await msg.guild.members.fetch(value.key)
//           receipts.push(
//             '```' +
//               member.user.username +
//               ' : ' +
//               '**something might went wrong with this transaction** ```'
//           )
//           winners.push(member.user.username)
//         }
//       }
//       const exampleEmbed = new Discord.MessageEmbed()
//         .setAuthor('Airdrop Receipt')
//         .setColor('#0099ff')
//         .setDescription(
//           args[2] +
//             ' COPE has been airdroped to ' +
//             args[1] +
//             ' people ' +
//             ':\n' +
//             receipts.join('\n')
//         )
//         .addFields({ name: 'Winners', value: winners, inline: true })
//       msg.reply(exampleEmbed)
//     })
//   }
