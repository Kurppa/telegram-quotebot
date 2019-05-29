const quoteService = require('./services/quoteService')

//change so also text with no quotes is accepted
const findQuoteText = (text) => {
    let res = text.match(/"(.*?)"/) //matches any text wrapped in doublequotes
    return res ? res[0] : null
} 

const replaceQuotes = (text) => text.replace(/"/g, '')
const randomInt = (min, max) => (
    Math.floor(Math.random() * ( max - min )) + min
)
const capitalize = (name) => (
    name.charAt(0).toUpperCase() + name.slice(1)
)


const addQuote = (msg) => {
    if (msg) {
        const quote = findQuoteText(msg)
            if (quote) {
                quoteService.addQuote(
                    {
                        user: msg.from.id,
                        author: arr[0].toLowerCase(),
                        quote: replaceQuotes(quote)
                    }
                )
            }
        }
}

const getQuoteWithName = async (msg) => {
    const arr = msg.split(' ')
    const name = arr[0].toLowerCase()
    if (!name) {
        return
    }
    const quotes = await quoteService.getQuotesWithName(name)
    if (quotes.length === 0) {
        return
    }
    const quote = quotes.length === 1 ? quotes[0] : quotes[randomInt(0, quotes.length)]
    return {
        author: capitalize(name),
        quote: quote.quote
    }
}

module.exports = { addQuote, getQuoteWithName }
