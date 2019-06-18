const mongoose = require('mongoose')
const Quote = require('../models/quoteModel')

let MONGODB_URI = process.env.MONGODB_URI 

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((e) => {
        console.log('Error connecting to MongoDB', e.message)
        return process.exit(2)
    })

mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)

const addQuote = (quoteObject) => {
    const  quote = new Quote(
        quoteObject
    )
    return quote.save()
}

const getRandomQuote = (chatId) => {
    return Quote.find({ chatId: chatId })
}

const getQuotesWithName = (chatId, name) => {
    return Quote.find({ chatId: chatId, author: name })
}

module.exports = { getRandomQuote, addQuote, getQuotesWithName }
