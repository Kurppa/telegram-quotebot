const mongoose = require('mongoose')
const Quote = require('../models/quoteModel')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
.then(() => {
    console.log('Connected to MongoDB')
})
.catch((e) => {
    console.log('Error connecting to MongoDB', error.message)
    return process.exit(2)
})

const addQuote = async (quoteObject) => {
  const quote = new Quote(
    quoteObject
  )

  try {
    await quote.save()
  } catch(e) {
    console.log(e.message)
  }

}

const getQuotesWithName = async (name) => {
    const quotes = await Quote.find({ author: name })
    return quotes
}

module.exports = { addQuote, getQuotesWithName }
