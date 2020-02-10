// @ts-check
const { Comments } = require('../models')

module.exports.insert = async function addComment(req, res) {
    const { blogId } = req.params
    const { commentBody } = req.body
    const userId = req.session.user.id

    if(!commentBody) {
        return res.status(400).json({
            message: 'Incomplete request'
        })
    }

    let comments = new Comments({});
    comments.blogId = blogId;
    comments.userId = userId;
    comments.commentBody = commentBody;

    try {
        await comments.save()
    } catch (error) {
        return res.status(500).json({
            message: 'Database error',
            error: error
        })
    }

    res.status(200).json(comments)
}

module.exports.delete = async function deleteComment(req, res) {
    const { commentId } = req.params
  
    const comment = await Comments.findOne({
      _id: commentId
    }).exec()
  
    if (!comment) {
      return res.status(404).json({
        message: 'Comment does not exist'
      })
    }
  
    await comment.remove()
  
    res.status(200).end()
  }

  module.exports.list = async function listCommentsByBlog(req, res) {
    const { blogId } = req.params
    //console.log(blogId)
    const comment = await Comments.find({ "blogId": blogId }).exec()
  
    res.status(200).json(comment)
  }

  module.exports.update = async function updateComment(req, res) {
    const { commentId } = req.params
    const { commentBody } = req.body
    console.log(commentId)
    console.log(commentBody)
  if (!commentBody) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const comment = await Comments.findOneAndUpdate({
    _id: commentId
  }, {
    commentBody
  }, {
    new: true
  }).exec()

  if (!Comments) {
    res.status(400).json({
      message: 'comment does not exist or no permission'
    })
  }

  res.status(200).json(Comments)
}