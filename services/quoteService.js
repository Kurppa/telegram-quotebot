const mongoose = require('mongoose')
const sanitize = require('mongo-sanitize')
const { findAliases } = require('./aliasService')
const Quote = require('../models/quoteModel')

let MONGODB_URI = process.env.MONGODB_URI 

//TODO move this to config
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
        sanitize(quoteObject)
    )
    return quote.save()
}

const getRandomQuote = (chatId) => {
    return Quote.find({ chatId: chatId })
}

const getQuotesWithName = async (chatId, name) => {
    try {
        name = sanitize(name.toLowerCase())
        const aliasList = await findAliases(name)
        if (aliasList) {
            return Quote.find({ chatId: chatId, author: { $in : aliasList }})    
        } else {
            return Quote.find({ chatId: chatId, author: name })
        }
    } catch (e) {
        throw "Something went wrong ;__;"
    }
}

module.exports = { getRandomQuote, addQuote, getQuotesWithName }
