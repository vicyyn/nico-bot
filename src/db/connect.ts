import { createConnection } from 'typeorm'
import Users from './model'

const connect = () => {
  const env = {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    isSsl: process.env.DB_IS_SSL === 'true',
  }

  const config = {
    type: env.type,
    host: env.host,
    port: env.port,
    username: env.username,
    password: env.password,
    database: env.database,
    entities: [Users],
    synchronize: true,
    logging: false,
    ssl: env.isSsl,
    extra: {
      ...(env.isSsl && {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    },
  }

  return createConnection(config as any).then(() =>
    console.log('Connected to 🪳DB')
  )
}

export default connect
