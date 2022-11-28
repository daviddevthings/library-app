const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: false,
        default: null
    },
    author: {
        type: String,
        required: false,

    },
    title: {
        type: String,
        required: false,
    },
    startDate: {
        type: Number,
        required: false,
        default: -1
    }
})

module.exports = mongoose.model('bookModel', bookSchema)