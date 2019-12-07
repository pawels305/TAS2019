const mongoose = require('mongoose')

const ImagePostSchema = mongoose.Schema({
    blogId: 
        { type: Number, required: true },
    img: 
        { data: Buffer, contentType: String },
    description:
        { type: String, required: false }
})

const ImagePost = mongoose.model('ImagePost', ImagePostSchema)

module.exports = ImagePost