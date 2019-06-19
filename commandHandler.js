const quoteService = require('./services/quoteService')

//matches text wrapped in double quotes
const findQuoteText = (text) => {
    const regex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g 
    const res = text.match(regex) //matches any text wrapped in double or single quotes
    return res
} 

//removes double quotes from the string
const replaceQuotes = (text) => text.replace(/['"]/g, '') 

//randomint between min & max
const randomInt = (min, max) => (
    Math.floor(Math.random() * ( max - min )) + min
)

//capitalize the first letter of word
const capitalize = (name) => (
    name.charAt(0).toUpperCase() + name.slice(1)
)

const addQuoteHandler = async (msg) => {
    const quoted = findQuoteText(msg.text)
    let quote
    let author
    if (quoted.length === 0) {
        throw "No quote found"
    } else if (quoted.length === 1) {
        quote = quoted[0]
        const restOfText = text.replace(quote, "")
        author = restOfText.split(" ")[0] || null
    } else if (quoted.length === 2) {
        author = quoted[0]
        quote = quoted[1]
    } else {
        throw "Something wrong"
    }
    if (author && quote) {
        try {
            await quoteService.addQuote({
                    user: msg.from.id,
                    author: replaceQuotes(author),
                    quote: replaceQuotes(quote),
                    chatId: msg.chat.id,
                })
        } catch (e) {
            throw "Failed to save quote"
        }
    } else {
        throw "Something wrong"
    }
}

const getQuoteHandler = async (msg) => {
    if (!msg.text) {
        const quotes = await quoteService.getRandomQuote(msg.chat.id)
        if (quotes.length === 0) {
            throw "No quotes for this chat"
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
            throw "No quotes for this name"
        } 

        const quote = quotes.length === 1 ? quotes[0] : quotes[randomInt(0, quotes.length)]
        return {
            author: capitalize(name),
            quote: quote.quote
        }
    }
}

module.exports = { addQuoteHandler, getQuoteHandler }
