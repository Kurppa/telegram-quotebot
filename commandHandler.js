const quoteService = require('./services/quoteService')

const findQuoteText = (text) => {
    const res = text.match(/"(.*?)"/) //matches any text wrapped in doublequotes
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
  const text = msg.text
  const arr = text.substring(7).split(' ')
    if (arr.length >= 2) {
        const quote = findQuoteText(arr.splice(1,arr.length).join(' '))
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
    const arr = msg.text.substring(5).split(' ')
    const name = arr[0].toLowerCase()
    const quotes = await quoteService.getQuotesWithName(name)
    const quote = quotes.length === 1 ? quotes[0] : quotes[randomInt(0, quotes.length)]
    return {
        author: capitalize(name),
        quote: quote.quote
    }
}

module.exports = { addQuote, getQuoteWithName }
