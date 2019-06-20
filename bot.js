const TelegramBot = require('node-telegram-bot-api')

const { addQuoteHandler, getQuoteHandler, addAliasHandler } = require('./commandHandler')
const AllowedChat = require('./models/allowedChat.js')

const token = process.env.BOT_TOKEN

let allowedChats = []

AllowedChat.find({})
    .then(chats => {
        allowedChats = chats.map(c => c.chatId)
     })

let bot

if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token)
    bot.setWebHook(`${process.env.URL}/`)
} else {
    bot = new TelegramBot(token, { polling: true })
}

//gets the first word as command and modifies the message object so the command part is removed
//by default bots only get messages starting with / or messages where the bot is mentioned
const getCommand = (msg) => {
    const firstWord =  msg.text.toLowerCase().split(' ')[0]
    return {
        command: firstWord && firstWord.startsWith('/') ? firstWord : null,
        message: {
            ...msg,
            text: msg.text.split(' ').slice(1).join(' ') || null
        }
    }
}

bot.on('message', async (msg) => {

    const chatId = msg.chat.id;
    
    if (!msg.text) {
        return
    }

    if (msg.text.length > 500) {
        bot.sendMessage(chatId, 'kys')
        return
    }

    const { command, message } = getCommand(msg) //commands are made to lowercase in getCommand
    
    if(!command) {
        return
    }
    
    if(!["/adda", "/allow", "/info", "/khelp", "/addq", "/getq"].includes(command)) {
        return
    }
    
    //auth not required
    switch (command) {
        case '/allow':
            if (allowedChats.includes(chatId)) {
                bot.sendMessage(chatId, `This chat is already allowed for use`)
            } else if (!message.text) {
                bot.sendMessage(chatId, `please provide a password to /allow`)
            } else {
                const password = message.text.split(" ")[0]
                if (password === process.env.PASSWORD) {
                    const chat = new AllowedChat({
                        chatId
                    })
                    try {
                        await chat.save()
                        allowedChats.push(chatId)
                        bot.sendMessage(chatId, `Added this chat to the list of allowed chats : )`)
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
            return
        case '/info':
            const infoMessage = 'This is a quotebot\n'
                + '  the bot requires authorization\n'
                + '  "\/allow password" to enable bot'
            bot.sendMessage(chatId, infoMessage) 
            return
    }

    if (!allowedChats.includes(chatId)) {
        bot.sendMessage(chatId, `You are not authorized to use this command ;__;`)
        return
    }

    //auth required
    switch (command){
        case '/addq':      
            if (!message.text) {
                return
            } 
            addQuoteHandler(message)
                .then(() => 
                    bot.sendMessage(chatId, `Quote added : )`)
                )
                .catch(e => {
                    bot.sendMessage(chatId, `${e}`)
                }) 
            break
        case '/getq':
            getQuoteHandler(message)
                .then(quote => {
                    bot.sendMessage(chatId, `${quote.author}: "${quote.quote}"`)
                })
                .catch(e => {
                    bot.sendMessage(chatId, `${e}`)
                })
            break
        case '/adda':
            if (!message.text) {
                return
            }
            addAliasHandler(message)
                .then(({alias1, alias2}) => {
                    bot.sendMessage(chatId, `New aliases ${alias1} and ${alias2}`)
                })
                .catch(e => {
                    bot.sendMessage(chatId, `${e}`)
                })
            break
        case '/khelp':
            const helpMessage = 'commands:\n'
                + '  \/addq author \"quotetext\"\n'
                + '  \/getq author'

            bot.sendMessage(chatId, helpMessage)
            break
        default:
            break
    }
})

module.exports = bot
