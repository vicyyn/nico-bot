import { prefix } from '../constants'
import {
  AccountInfo,
  Keypair,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js'
import fs from 'fs'
import { promisify } from 'util'
import path from 'path'
import moment from 'moment'

type GetArgsFunc = (command: string) => string[]

export const getArgs: GetArgsFunc = command => {
  return command
    .slice(prefix.length)
    .trim()
    .split(' ')
    .filter(a => a !== '')
}

export const getUidFromTag = (tag: string) => {
  const uids = tag.match(/\d+/)
  if (uids == null) {
    throw new Error('Null Exception')
  }
  return uids[0]
}

export const getAmount = (amount: string, decimals: number) => {
  const amountParsed = parseFloat(amount.replace(',', '.'))
  if (isNaN(amountParsed)) {
    throw new Error('Amount is not a number')
  }
  return amountParsed * 10 ** decimals
}

class FormattedHelp {
  commands: string[] = []
  outro = `
  **How to set up tip bot:**
Make sure you set your DM settings to Allow direct messages from server members (you can change it from Settings -> Privacy & Safety) and then type ? connect.
The bot will send you a DM and you will have to reply with the private sollet key. Make sure its a BURNER wallet and you have to mint Cope and have a small amount of SOL for the fees.
`
  to(todo: string, command: string) {
    this.commands.push(
      `- to ${todo} \`\`${prefix}COMMAND\`\` `.replace('COMMAND', command)
    )
    return this
  }

  end() {
    return this.commands.join('\n') + '\n' + this.outro
  }
}
export const formattedHelp = () => new FormattedHelp()

export const getAuthors = async () => {
  const reader = promisify(fs.readFile)
  const file = await reader(path.join(__dirname, '../../', 'data.json'), 'utf8')
  const data = JSON.parse(file)
  return data.authors
}

export const getBurned = async () => {
  const reader = promisify(fs.readFile)
  const file = await reader(path.join(__dirname, '../../', 'data.json'), 'utf8')
  const data = JSON.parse(file)
  return data.burned
}

export type TokenAccount = {
  account: AccountInfo<ParsedAccountData>
  pubkey: PublicKey
}

type GetAccountsByOwnerAndMintFunc = (
  token: TokenAccount[]
) => { pubkey: PublicKey; balance: number }[]

export const getBalanceFromAccount: GetAccountsByOwnerAndMintFunc = token =>
  token.map(({ pubkey, account: { data } }) => ({
    pubkey,
    balance: data.parsed.info.tokenAmount.uiAmountString,
  }))

export const logger = (
  action: string,
  issuedBy: string,
  didFail?: boolean,
  error?: any
) => {
  console.log(
    `${didFail ? 'FAIL' : 'LOG'} : ${moment()} - [${action}] BY ${issuedBy}`
  )
  if (didFail) {
    console.log(error.message)
  }
}

export const retry = async (maxRetries: number, fn: Function) => {
  return await fn().catch(function (err: any) {
    if (maxRetries <= 0) {
      throw err;
    }
    return retry(maxRetries - 1, fn);
  });
}