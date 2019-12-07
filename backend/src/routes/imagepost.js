// @ts-check
const { ImagePost } = require('../models')

module.exports.insert = async function addImagePost(req, res) {
  const { blogId } = req.params
  const { image, description } = req.body

  console.log(blogId)
  console.log(image)
  console.log(description)

  if (!image) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  // var encImg = image.toString('base64');

  const imagePost = new ImagePost({ blogId, image, description})

  try {
    await imagePost.save()
  } catch (error) {
    return res.status(500).json({
      message: 'Database error',
      error: error
    })
  }

  res.status(200).json(imagePost)
}

module.exports.get = async function getImagePost(req, res) {
  const { imageId } = req.params

  const image = await ImagePost.findOne({
    _id: imageId
  }).exec()

  if (!image) {
    return res.status(404).json({
      message: 'Image does not exist'
    })
  }
  res.status(200).json(image)
}

module.exports.update = async function updateImagePost(req, res) {
    const { imageId } = req.params
    const { blogId, image, description } = req.body

  if (!image) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const imagePost = await ImagePost.findOneAndUpdate({
    _id: imageId,
    blogId
  }, {
    image,
    description
  }, {
    new: true
  }).exec()

  if (!imagePost) {
    res.status(400).json({
      message: 'Image does not exist or no permission'
    })
  }

  res.status(200).json(imagePost)
}

module.exports.delete = async function deleteImagePost(req, res) {
  const { imageId } = req.params

  const image = await ImagePost.findOne({
    _id: imageId
  }).exec()

  if (!image) {
    return res.status(404).json({
      message: 'Image does not exist'
    })
  }

  await image.remove()

  res.status(200).end()
}

module.exports.list = async function listImagePostsByBlog(req, res) {
  const { blogId } = req.params

  const image = await ImagePost.find().select({ "blogId": blogId }).exec()

  res.status(200).json(image)
}
