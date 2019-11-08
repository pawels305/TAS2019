// @ts-check
const { Blog } = require('../models')

module.exports.insert = async function createBlog (req, res) {
  const userId = req.session.user.id
  const { name } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }
  const blog = new Blog({ userId, name })

  try {
    await blog.save()
  } catch (error) {
    return res.status(500).json({
      message: 'Database error',
      error: error
    })
  }

  res.status(200).json(blog)
}

module.exports.list = async function listBlogs (req, res) {
  const userId = req.session.user.id
  const blog = await Blog.find({
    userId
  }, {
    userId: 0
  }).exec()
  res.status(200).json(blog)
}
