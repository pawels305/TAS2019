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
  tag: {
	  type: String,
	  required: true,
	  unique: false
  }
}, {
  versionKey: false,
  timestamps: true
})

const Blog = mongoose.model('Blog', BlogSchema)

module.exports = Blog
