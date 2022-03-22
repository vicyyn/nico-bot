import { PublicKey } from '@solana/web3.js'
import CoinGecko from 'coingecko-api'

export const CoinGeckoClient = new CoinGecko()

export const TIP_JAR = new PublicKey(
  'DbkehNrXkTgMgLxYKsFvUFgayHnYa5e5wqe7sTd1WC88'
)
export const BURN_JAR = new PublicKey(
  'DbkehNrXkTgMgLxYKsFvUFgayHnYa5e5wqe7sTd1WC88'
)

export const getBearerTokenEnv = {
  authority: process.env.GET_BEARER_AUTHORITY || '',
  origin: process.env.GET_BEARER_URL || '',
  referer: process.env.GET_BEARER_URL || '',
  apiUrl: process.env.GET_BEARER_API_URI || '',
  email: process.env.GET_BEARER_EMAIL || '',
  password: process.env.GET_BEARER_PASSWORD || '',
}

export const getFundsEnv = {
  authority: 'zarya-backend-mediator-pidzqxgs7a-uc.a.run.app',
  origin: 'https://pro.nansen.ai',
  referer: 'https://pro.nansen.ai',
  apiUrl:
    'https://zarya-backend-mediator-pidzqxgs7a-uc.a.run.app/v1/questions/sm_funds_leaderboard',
}
