const mongoose = require('mongoose')

const BlogSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
   creationDate: {
    type: Date,
    required: true,
    unique: false
  },
  posts: {
    type: []
  })

const Blog = mongoose.model('Blog', BlogSchema)

module.exports = Blog