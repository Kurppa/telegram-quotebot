process.env.NTBA_FIX_319 = 3 //magic lines

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const TelegramBot = require('node-telegram-bot-api')
const { quoteHandler } = require('./commandHandler')

const token = process.env.BOT_TOKEN

if (!token) {
    console.log('No token given ;__;')
    return process.exit(1)
}

const bot = new TelegramBot(token, { polling: true})

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (chatId !== process.env.ALLOWED_ID) {
        return bot.sendMessage(chatId, 'elä laita tämmöstä')
    }

    if (msg.text.toLowerCase().startsWith('/quote ')) {        
        await quoteHandler(msg)
    }
})
