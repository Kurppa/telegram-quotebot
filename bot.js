process.env.NTBA_FIX_319 = 3 //magic lines

const TelegramBot = require('node-telegram-bot-api')

const { addQuote, getQuoteWithName } = require('./commandHandler')

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
    
    console.log(chatId, msg.chat.title)

    if (chatId !== Number(process.env.ALLOWED_ID)) {
        return
    }

    const command = getCommand(msg.text)

    //commands are made to lowercase in getCommand
    switch (command){
        case '/quote':
            await addQuote(msg)
            break
        case '/get':
            const { author, quote} = await getQuoteWithName(msg)
            if (author && quote) {
                bot.sendMessage(chatId, `${author}: "${quote}"`)
            }
            break
        case '/khelp':
            bot.sendMessage(chatId, 'No help here')
            break
        default:
            break
    }
})

module.exports.bot
