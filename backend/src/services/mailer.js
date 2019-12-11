const nodemailer = require('nodemailer')
const config = require('../config.template')
const jwt = require('jsonwebtoken')

const transporter = nodemailer.createTransport(config.mailConfig)

/**
 * @param {string} username
 * @param {string} confirmUrl
 */
function getVerifyEmailTemplate (username, confirmUrl) {
  return `Cześć ${username}, potwierdź swój adres e-mail klikając w link poniżej:
<br><a href="${confirmUrl}">Potwierdź adres e-mail</a>`
}

/**
 * @param {string} username
 * @param {string} resetUrl
 */
function getPasswordResetTemplate (username, resetUrl) {
  return `Cześć ${username}, dostaliśmy prośbę o zresetowanie hasła do Twojego konta.
<br>Jeśli ta prośba nie pochodzi od Ciebie, zignoruj tę wiadomość.
<br><a href="${resetUrl}">Zresetuj hasło</a>`
}

/**
 * Generates JWT token
 * @param {'verify'|'reset'} type Token type
 * @param {string} email User email
 */
function generateToken (type, email) {
  return new Promise((resolve) => {
    let tokenType
    if (type === 'verify') tokenType = 'v'
    else if (type === 'reset') tokenType = 'r'
    if (!tokenType) throw new Error('Unknown token type')

    const obj = {
      t: tokenType,
      e: email
    }

    jwt.sign(obj, config.cookieSecret, {
      expiresIn: '15m',
      noTimestamp: true
    }, (e, token) => {
      resolve(token)
    })
  })
}

/**
 * @param {string} username
 * @param {string} email
 */
async function sendVerificationEmail (username, email) {
  const token = await generateToken('verify', email)
  const confirmUrl = config.backendUrl + '/api/user/verify/' + token

  transporter.sendMail({
    from: config.mailSender,
    to: email,
    subject: 'Potwierdź adres e-mail',
    html: getVerifyEmailTemplate(username, confirmUrl)
  })
}

/**
 * @param {string} username
 * @param {string} email
 */
async function sendPasswordResetEmail (username, email) {
  const token = await generateToken('reset', email)
  const resetUrl = config.frontendUrl + '/login/resetPassword/' + token

  transporter.sendMail({
    from: config.mailSender,
    to: email,
    subject: 'Resetowanie hasła',
    html: getPasswordResetTemplate(username, resetUrl)
  })
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
}

if (process.env.NODE_ENV === 'test') {
  module.exports.generateToken = generateToken
}
