process.env.NTBA_FIX_319 = 3 //magic lines

const TelegramBot = require('node-telegram-bot-api')

const { addQuote, getQuoteWithName } = require('./commandHandler')

const token = process.env.BOT_TOKEN

let bot

const allowed_id = process.env.ALLOWED_ID

if (!allowed_id) {
    console.log('no allowed chat id set')
    process.exit(1)
}

if (process.env.NODE_EN === 'production') {
    bot = new TelegramBot(token)
    bot.setWebHook(process.env.HEROKU_URL + bot.token)
} else {
    bot = new TelegramBot(token, { polling: true })
}

//gets the first word as command and modifies the message object so the command part is removed
//by default bots only get messages starting with / or messages where the bot is mentioned
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
    
    const { command, message } = getCommand(msg) //commands are made to lowercase in getCommand

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
            } else {
                bot.sendMessage(chatId, `No quotes for the given name`)
            }
            break
        case '/khelp':
            const helpMessage = 'commands:\n'
                + '  \/quote author \"quotetext\"\n'
                + '  \/get author'

            bot.sendMessage(chatId, helpMessage)
            break
        default:
            break
    }
})

