// @ts-check

const jwt = require('jsonwebtoken')
const { User } = require('../models')
const mailer = require('../services/mailer')
const config = require('../config.template.js')
const { validatePassword } = require('../services/crypto')

/*
 * Error Codes:
 *  0 - IncompleteRequest
 *  1 - InvalidEmail
 *  2 - AlreadyUsed
 */
module.exports.register = async (req, res) => {
  const { username, email, password } = req.body

  // check required parameters
  if (!username || !password || !email) {
    return res.status(400).json({
      errorCode: 0,
      message: 'Incomplete request'
    })
  }

  // validate email
  if (!validateEmail(email)) {
    return res.status(400).json({
      errorCode: 1,
      message: 'Email must be valid'
    })
  }

  const user = new User({ email, username, password })

  try {
    await user.save()
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        errorCode: 2,
        message: 'This username or email is already used'
      })
    }

    return res.status(500).json({
      message: 'Database error',
      error: error
    })
  }

  if (!config.skipEmailVerification) {
    mailer.sendVerificationEmail(username, email)
  }

  res.status(200).end()
}

/*
 * Error Codes:
 *  0 - InvalidPassword
 *  1 - UserDoesNotExist
 *  2 - EmailNotVerified
 */
module.exports.login = async (req, res) => {
  if (!req.session) {
    return res.status(500).json({
      message: 'Creating session failed'
    })
  }

  if (req.session.user) {
    req.session.user = null
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const user = await User.findOne({
    'username': username
  }).exec()

  if (!user) {
    return res.status(400).json({
      errorCode: 1,
      message: 'User does not exist'
    })
  }

  const validated = await validatePassword(password, user.password)

  if (!validated) {
    return res.status(400).json({
      errorCode: 0,
      message: 'Wrong username or password'
    })
  }

  if (!user.isVerified && !config.skipEmailVerification) {
    return res.status(400).json({
      errorCode: 2,
      message: 'Email is not verified'
    })
  }

  req.session.user = {
    id: user._id,
    role: user.role,
    username: user.username
  }

  return res.status(200).json(req.session.user)
}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.status(200).end()
}

module.exports.getUser = (req, res) => {
  // TODO: Sanitize user object
  res.status(200).json(req.session.user)
}

module.exports.updateUser = async (req, res) => {
  const { currentPassword, username, password, email } = req.body

  const user = await User.findOne({
    _id: req.session.user.id
  }).exec()

  if (!user) {
    req.session.destroy()
    return res.status(500).end()
  }

  if (username) {
    user.username = username

    try {
      await user.save()
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          message: 'This username is already used'
        })
      }

      return res.status(500).json({
        message: 'Could not change username'
      })
    }

    req.session.user.username = username
  } else {
    if (!(password || email)) {
      return res.status(400).json({
        message: 'Incomplete request'
      })
    }

    if (!(currentPassword && await validatePassword(currentPassword, user.password))) {
      return res.status(401).json({
        message: 'Invalid password'
      })
    }

    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: 'Email must be valid'
        })
      }

      user.email = email
      user.isVerified = false

      try {
        await user.save()

        if (!config.skipEmailVerification) {
          mailer.sendVerificationEmail(user.username, email)
        }
      } catch (err) {
        if (err.code === 11000) {
          return res.status(400).json({
            message: 'This email is already used'
          })
        }

        return res.status(500).json({
          message: 'Could not change email'
        })
      }
    } else if (password) {
      user.password = password

      try {
        await user.save()
      } catch (err) {
        res.status(500).json({
          message: 'Could not update password'
        })
      }
    }
  }

  res.status(200).end()
}

module.exports.verifyEmail = (req, res) => {
  const { token } = req.params

  jwt.verify(token, config.cookieSecret, async (err, decoded) => {
    if (err || decoded.t !== 'v') {
      return res.status(400).json({
        message: 'Invalid token'
      })
    }

    const email = decoded.e

    try {
      const user = await User.findOneAndUpdate({
        email: email
      }, {
        isVerified: true
      }).exec()

      if (!user) {
        return res.status(400).json({
          message: 'Could not verify'
        })
      }

      res.redirect(config.frontendUrl)
    } catch (err) {
      return res.status(500).end()
    }
  })
}

module.exports.sendReset = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const user = await User.findOne({ email })

  if (!user || !user.isVerified) {
    return res.status(200).end()
  }

  mailer.sendPasswordResetEmail(user.username, email)

  res.status(200).end()
}

module.exports.resetPassword = async (req, res) => {
  const { token, password } = req.body

  if (!token || !password) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  jwt.verify(token, config.cookieSecret, async (err, decoded) => {
    if (err || decoded.t !== 'r') {
      return res.status(400).json({
        message: 'Invalid token'
      })
    }

    const email = decoded.e

    try {
      const user = await User.findOneAndUpdate({ email }, { password }).exec()

      if (!user) {
        return res.status(400).json({
          message: 'Could not verify'
        })
      }

      res.status(200).end()
    } catch (err) {
      return res.status(500).end()
    }
  })
}

/**
 * Validates email
 * @param {string} email
 */
function validateEmail (email) {
  const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegexp.test(email)
}
