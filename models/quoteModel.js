const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({
    //user is the one who added this quote, saved with id
    user: {
        type: Number,
        required: true
    },
    quote: {
        type: String,
        required: true,
        maxlength: 200,
        minlength: 3,
    },
    //author represents the 'by' in quote
    author: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Quote = mongoose.model('Quote', quoteSchema)

module.exports = Quote
