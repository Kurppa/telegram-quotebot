process.env.NTBA_FIX_319 = 3 //magic lines

const TelegramBot = require('node-telegram-bot-api')

const { addQuoteHandler } = require('./commandHandler')

const token = process.env.BOT_TOKEN

let bot

if (process.env.NODE_EN === 'production') {
    bot = new TelegramBot(token)
    bot.setWebHook(process.env.HEROKU_URL + bot.token)
} else {
    bot = new TelegramBot(token, { polling: true })
}

//tools
const getCommand = (text) => text.toLowerCase().split(' ')[0] || null

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (chatId !== Number(process.env.ALLOWED_ID)) {
        return
    }

    const command = getCommand(msg.text)

    console.log(command)

    switch (command){
        case '/quote':
            await addQuoteHandler(msg)
            break
        default:
            break
    }
})

module.exports.bot
