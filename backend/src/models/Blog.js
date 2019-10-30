const mongoose = require('mongoose')

const BlogSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: false,
    unique: true
  },
   creationDate: {
    type: Date,
    required: false,
    unique: false
  },
  posts: {
    type: [],
	required: false
  }
})

const Blog = mongoose.model('Blog', BlogSchema)

module.exports = Blog
