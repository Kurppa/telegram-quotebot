const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    alias: [{
        type: String,
        required: true
    }],
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author
