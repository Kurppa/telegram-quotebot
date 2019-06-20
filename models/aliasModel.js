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
            unique: true,
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

aliasSchema.plugin(uniqueValidator)
aliasSchema.plugin(uniqueArrayValidator)

const Alias = mongoose.model('Alias', aliasSchema)

module.exports = Alias
