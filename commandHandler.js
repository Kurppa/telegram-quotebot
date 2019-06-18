const quoteService = require('./services/quoteService')

const findQuoteText = (text) => {
    let res = text.match(/"(.*?)"/) //matches any text wrapped in double quotes
    return res ? res[0] : null
} 

const replaceQuotes = (text) => text.replace(/"/g, '') //removes " -marks from the string

const randomInt = (min, max) => (
    Math.floor(Math.random() * ( max - min )) + min
)

const capitalize = (name) => (
    name.charAt(0).toUpperCase() + name.slice(1)
)

const addQuoteHandler = async (msg) => {
    const author = msg.text.split(' ')[0].toLowerCase()
    const quote = findQuoteText(msg.text.split(' ').splice(1).join(' '))
    if (quote) {
        try {
            await quoteService.addQuote(
                {
                    user: msg.from.id,
                    author: author,
                    quote: replaceQuotes(quote),
                    chatId: msg.chat.id,
                }
            )
            
        } catch (e) {
            throw "Failed to save the quote"
        }
    } else {
        throw "Didn't find a quote ;__;"
    }
}

const getQuoteHandler = async (msg) => {
    if (!msg.text) {
        const quotes = await quoteService.getRandomQuote(msg.chat.id)
        if (quotes.length === 0) {
            return null
        }
        const quote = quotes.length === 1 ? quotes[0] : quotes[randomInt(0, quotes.length)]
        return {
            author: capitalize(quote.author),
            quote: quote.quote
        }
    } else { 
        const name = msg.text.split(' ')[0].toLowerCase()
       
        const quotes = await quoteService.getQuotesWithName(msg.chat.id,name)
        if (quotes.length === 0) {
            return null
        } 

        const quote = quotes.length === 1 ? quotes[0] : quotes[randomInt(0, quotes.length)]
        return {
            author: capitalize(name),
            quote: quote.quote
        }
    }
}

module.exports = { addQuoteHandler, getQuoteHandler }
