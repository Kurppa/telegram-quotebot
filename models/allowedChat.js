const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const allowedChat = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

allowedChat.plugin(uniqueValidator)

const AllowedChat = mongoose.model('AllowedChat', allowedChat)

module.exports = AllowedChat
