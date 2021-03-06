const mongoose = require('mongoose')

const ImagePostSchema = mongoose.Schema({
    blogId: 
        { type: String, required: true },
    img: 
        { data: String, contentType: String },
    description:
        { type: String, required: false }
})

const ImagePost = mongoose.model('ImagePost', ImagePostSchema)

module.exports = ImagePost