// @ts-check
const { Blog } = require('../models')

module.exports.insert = async function createBlog (req, res) {
  const userId = req.session.user.id
  const { name, tag } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }
  const blog = new Blog({ userId, name, tag })

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

module.exports.get = async function getBlog (req, res) {
  const { blogId } = req.params

  const blog = await Blog.findOne({
    _id: blogId
  }).exec()

  if (!blog) {
    return res.status(404).json({
      message: 'Blog does not exist'
    })
  }
  res.status(200).json(blog)
}

module.exports.update = async function updateBlog (req, res) {
  const userId = req.session.user.id
  const { blogId } = req.params
  const { name } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const blog = await Blog.findOneAndUpdate({
    _id: blogId,
    userId
  }, {
    name
  }, {
    new: true
  }).exec()

  if (!blog) {
    res.status(400).json({
      message: 'Blog does not exist or no permission'
    })
  }

  res.status(200).json(blog)
}

module.exports.delete = async function deleteBlog (req, res) {
  const userId = req.session.user.id
  const { blogId } = req.params

  const blog = await Blog.findOne({
    _id: blogId
  }).exec()

  if (!blog) {
    return res.status(404).json({
      message: 'Blog does not exist'
    })
  }
  if (!blog.userId.equals(userId)) {
    return res.status(401).end()
  }

  await blog.remove()

  res.status(200).end()
}

module.exports.list = async function listBlogs (req, res) {
  // const userId = req.session.user.id
  const blog = await Blog.find().exec()
  res.status(200).json(blog)
}
