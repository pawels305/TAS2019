// @ts-check
const express = require('express')

const auth = require('./users')
const blog = require('./blog')

const verifyLogin = require('../middleware/verifyLogin')

const router = express.Router()

router.post('/login', auth.login)
router.post('/logout', auth.logout)
router.post('/register', auth.register)

router.get('/user', verifyLogin, auth.getUser)
router.patch('/user', verifyLogin, auth.updateUser)
router.get('/user/verify/:token', auth.verifyEmail)
router.post('/user/sendReset', auth.sendReset)
router.post('/user/resetPassword', auth.resetPassword)
router.patch('/user', auth.updateUser)
router.delete('/user/:tag', verifyLogin, auth.deleteTag)

router.post('/blog/', verifyLogin, blog.insert)
router.get('/blog/:blogId', verifyLogin, blog.get)
router.put('/blog/:blogId', verifyLogin, blog.update)
router.delete('/blog/:blogId', verifyLogin, blog.delete)
router.get('/blog/', verifyLogin, blog.list)

module.exports = router
