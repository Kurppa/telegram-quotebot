const quoteService = require('./services/quoteService')

const findQuoteText = (text) => {
    const res = text.match(/"(.*?)"/)
    return res ? res[0] : null
} 


const quoteHandler = (msg) => {
  const text = msg.text
  const arr = text.substring(7).split(' ')
    if (arr.length >= 2) {
        const quote = findQuoteText(arr.splice(1,arr.length).join(' '))
            if (quote) {
                quoteService.addQuote(
                    {
                        user: msg.from.id,
                        author: arr[0].toLowerCase(),
                        quote: quote.replace(/"/g, '')
                    }
                )
            }
        }
}

module.exports = { quoteHandler }
