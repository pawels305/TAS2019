const mongoose = require('mongoose')

const CommentsSchema = mongoose.Schema({
    blogId: 
        { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: 
        { type: mongoose.Schema.Types.ObjectId, required: false },
    commentBody:
        { type: String, required: true }
})

const Comments = mongoose.model('Comments', CommentsSchema)

module.exports = Comments