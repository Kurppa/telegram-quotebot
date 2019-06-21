const quoteService = require('./services/quoteService')
const aliasService = require('./services/aliasService')

//matches text wrapped in double quotes
const findQuoteText = (text) => {
    const regex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g 
    const res = text.match(regex) //matches any text wrapped in double or single quotes
    return res
} 

//removes double and single quotes from the string
const replaceQuotes = (text) => text.replace(/['"]/g, '') 

//randomint between min & max
const randomInt = (min, max) => (
    Math.floor(Math.random() * ( max - min )) + min
)

//capitalize the first letter of word
const capitalize = (name) => (
    name.charAt(0).toUpperCase() + name.slice(1)
)

const addAliasHandler = async (msg) => {
    let text = msg.text
    text = text.replace(/”/g, '"')
    const quoted = findQuoteText(text)
    let alias1
    let alias2
    if (!quoted) {
        const pieces = text.split(" ")
        if (pieces.length !== 2) {
            throw "This all seems a bit confusing"
        } else {
            alias1 = pieces[0]
            alias2 = pieces[1]
        }
    } else if (quoted.length === 1) {
        alias1 = quoted[0]
        const restOfText = text.replace(alias1, "").trim()
        alias2 = restOfText.split(" ")[0] || null
        alias1 = replaceQuotes(alias1)
    } else if (quoted.length === 2) {
       alias1 = replaceQuotes(quoted[0])
       alias2 = replaceQuotes(quoted[1])
    }
    if (alias1 && alias2) {
        try {
            await aliasService.addAlias(alias1, alias2, msg.chat.id)
            return { alias1, alias2 }
        } catch (e) {
            if (e.code && e.code === 1) {
                throw e.message
            } else {
                throw "Failed to add alias"
            }
        }
    } else {
        throw "Something wrong"
    }
}

const addQuoteHandler = async (msg) => {
    let text = msg.text
    text = text.replace(/”/g, '"')
    const quoted = findQuoteText(text)
    let quote
    let author
    if (!quoted) {
        throw "No quote found"
    } else if (quoted.length === 1) {
        quote = quoted[0]
        const restOfText = text.replace(quote, "")
        author = restOfText.split(" ")[0] || null
    } else if (quoted.length === 2) {
        author = quoted[0]
        quote = quoted[1]
    } else {
        throw "Found too many quotes"
    }
    if (author && quote) {
        try {
            await quoteService.addQuote({
                    user: msg.from.id,
                    author: replaceQuotes(author.toLowerCase()),
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
        const quoted = findQuoteText(msg.text)
        const name = quoted ? replaceQuotes(quoted[0].toLowerCase()) : msg.text.split(' ')[0].toLowerCase()
       
        const quotes = await quoteService.getQuotesWithName(msg.chat.id,name)
        if (quotes.length === 0) {
            throw "No quotes for this name"
        } 

        const quote = quotes.length === 1 ? quotes[0] : quotes[randomInt(0, quotes.length)]
        return {
            author: quote.author.split(" ").map(word => { 
                let part = capitalize(word)
                return part
                }).join(" "),
            quote: quote.quote
        }
    }
}

module.exports = { addQuoteHandler, getQuoteHandler, addAliasHandler }
