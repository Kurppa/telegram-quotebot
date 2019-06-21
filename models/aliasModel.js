const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const uniqueArrayValidator = require('mongoose-unique-array')

const aliasSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true
    },
    aliases: [
        {
            type: String,
            minlength: 3
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

aliasSchema.plugin(uniqueValidator)

const Alias = mongoose.model('Alias', aliasSchema)

module.exports = Alias
