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

const getCommand = (msg) => (
    {
        command: msg.text.toLowerCase().split(' ')[0] || null,
        message: {
            ...msg,
            text: msg.text.toLowerCase().split(' ').slice(1).join(' ') || null
        }
    }
)

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    
    if (chatId !== Number(process.env.ALLOWED_ID)) {
        return
    }
    if (!msg.text) {
        return
    }
    
    const { command, message } = getCommand(msg)

    //commands are made to lowercase in getCommand
    switch (command){
        case '/quote':
            if (!message.text) {
                return
            }
            await addQuote(message)
            break
        case '/get':
            if (!message.text) {
                return
            }
            const quote = await getQuoteWithName(message)
            if (quote) {
                bot.sendMessage(chatId, `${quote.author}: "${quote.quote}"`)
            }
            break
        case '/khelp':
            bot.sendMessage(chatId, 'No help here')
            break
        default:
            break
    }
})

module.exports = bot
