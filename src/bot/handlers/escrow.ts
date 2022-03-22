import { Keypair, PublicKey } from '@solana/web3.js'
import {
  cancelEscrow,
  exchange,
  getAccountsByOwnerAndMint,
  initializeEscrow,
} from '../../blockchain'
import { logger } from '../utils'
import type { Client, ClientUser, Message } from 'discord.js'
import { MessageEmbed } from 'discord.js'
import { getUser } from '../../db'

export const escrow = async (
  message: Message,
  client: Client,
  args: string[]
) => {
  try {
    logger('ESCROW', message.author.id)
    console.log(args)
    const payer = await getUser(message.author.id)
    const escrowAccount = new Keypair()
    const give = new PublicKey(args[2])
    const tokenDeposit = await getAccountsByOwnerAndMint(payer.getPublicKey(), give, payer.getKeyPair())
    const ask = new PublicKey(args[3])
    const tokenReceive = await getAccountsByOwnerAndMint(payer.getPublicKey(), ask, payer.getKeyPair())
    const i_tx = await initializeEscrow(payer.getKeyPair(), Number(args[0]), Number(args[1]), escrowAccount, tokenDeposit[0].pubkey, tokenReceive[0].pubkey)
    console.log(i_tx)

    const exampleEmbed = new MessageEmbed()
      .setTitle('Trade by ' + message.author.username)
      .setColor('#0099ff')
      .setDescription(
        '**Escrow Initialized:** ' +
        i_tx +
        '\n\n**Escrow Account:** ' +
        escrowAccount.publicKey.toBase58() +
        '\n\u200B\n╭✧Selling : ' +
        give +
        ' - ' +
        args[0] +
        '\n ╰✧Buying : ' +
        ask +
        ' - ' +
        args[1] +
        '\n\n✅ Accept trade (Taker) \n🚫 Cancel trade and get funds back (Maker)\n\n'
      )
      .setFooter(
        'Beware of scammers! make sure the mint is legitimate. Trade expires in 5 minutes, once expires the funds will be settled automatically\n\n' +
        'To settle funds manually type:\n? cancelescrow ' +
        escrowAccount.publicKey.toBase58() +
        ' ' +
        tokenDeposit,
        'https://imgur.com/nphgfqJ.jpg'
      )

    await message
      .reply({ embeds: [exampleEmbed] })
      .then(async messageReaction => {
        messageReaction.react('✅')
        messageReaction.react('🚫')

        const collector = messageReaction.createReactionCollector(
          {
            filter: (messageReaction, user) => { return user.id != (client.user as ClientUser).id },
            time: 300000
          }
        );

        collector.on("collect", async (reaction, user) => {
          if (user.id != message.author.id && reaction.emoji.name === "✅") {
            try {
              let taker_private = await getUser(user.id)
              let taker_deposit = await getAccountsByOwnerAndMint(taker_private.getPublicKey(), ask, taker_private.getKeyPair())
              let taker_receive = await getAccountsByOwnerAndMint(taker_private.getPublicKey(), give, taker_private.getKeyPair())
              let e_tx = await exchange(taker_private.getKeyPair(), taker_deposit[0].pubkey, taker_receive[0].pubkey, tokenDeposit[0].pubkey, escrowAccount.publicKey, payer.getPublicKey(), tokenReceive[0].pubkey)
              const exampleEmbed = new MessageEmbed()
                .setTitle("Trade by " + message.author.username)
                .setColor("#0099ff")
                .setDescription("**Escrow Initialized:** " + i_tx + "\n\n**Escrow Account:** " + escrowAccount.publicKey.toBase58() + "\n\u200B\n╭✧Selling : " + ask + " - " + args[1] + "\n ╰✧Buying : " + give + " - " + args[2] + "\n\n**Escrow Successful:** " + e_tx + "\n\n" + user.username + " accepted the trade")
                .setFooter({ text: "Beware of scammers! make sure the mint is legitimate. Trade expires in 5 minutes, once expires the funds will be settled automatically\n\n" + "To settle funds manually type:\n? cancelescrow " + escrowAccount.publicKey.toBase58() + " " + tokenDeposit, iconURL: "https://imgur.com/nphgfqJ.jpg" })
              console.log(e_tx)
              messageReaction.edit({ embeds: [exampleEmbed] });
              collector.stop()
            } catch (err) {
              console.log(err)
            }
          }

          if (user.id == message.author.id && reaction.emoji.name === '🚫') {
            try {
              let c_tx = await cancelEscrow(
                payer.getKeyPair(),
                tokenDeposit[0].pubkey,
                escrowAccount.publicKey
              )
              const exampleEmbed = new MessageEmbed()
                .setTitle('Trade by ' + message.author.username)
                .setColor('#0099ff')
                .setDescription(
                  '**Escrow Initialized:** ' +
                  i_tx +
                  '\n\n**Escrow Account:** ' +
                  escrowAccount.publicKey.toBase58() +
                  '\n\u200B\n╭✧Selling : ' +
                  ask +
                  ' - ' +
                  args[1] +
                  '\n ╰✧Buying : ' +
                  give +
                  ' - ' +
                  args[2] +
                  '\n\n**Escrow Canceled:** ' +
                  c_tx +
                  '\n\n'
                )
                .setFooter({
                  text:
                    'Beware of scammers! make sure the mint is legitimate. Trade expires in 5 minutes, once expires the funds will be settled automatically\n\n' +
                    'To settle funds manually type:\n? cancelescrow ' +
                    escrowAccount.publicKey.toBase58() +
                    ' ' +
                    tokenDeposit,
                  iconURL: 'https://imgur.com/nphgfqJ.jpg',
                })
              console.log(c_tx)
              messageReaction.edit({ embeds: [exampleEmbed] })
              collector.stop()
            } catch (err) { }
          }
          reaction.users.remove(user)
        })
      })
  } catch (e: any) {
    message.reply('something went wrong')
    logger('ESCROW', message.author.id, true, e)
  }
}
