process.env.NTBA_FIX_319 = 3 //magic lines

require('dotenv').config()

let bot = require('./bot')
require('./web')(bot)
