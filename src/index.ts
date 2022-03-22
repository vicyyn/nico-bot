import 'dotenv/config'
import 'reflect-metadata'
import db from './db/connect'

import main from './main'

db().then(main)
