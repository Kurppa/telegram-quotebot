const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const quoteSchema = new mongoose.Schema({
    user: {
        type: Number,
        required: true
    },
    chatId: {
        type: String,
        required: true
    },
    quote: {
        type: String,
        required: true,
        unique: true,
        maxlength: 400,
        minlength: 3,
    },
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

quoteSchema.plugin(uniqueValidator)

const Quote = mongoose.model('Quote', quoteSchema)

module.exports = Quote
