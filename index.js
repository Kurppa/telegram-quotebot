process.env.NTBA_FIX_319 = 3 //magic lines

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

let bot = require('./bot')
require('./web')(bot)
