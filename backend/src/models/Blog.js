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
  }
}, {
  versionKey: false,
  timestamps: true
})

const Blog = mongoose.model('Blog', BlogSchema)

module.exports = Blog
