const ENV = process.env.NODE_ENV || 'development'

/* DO NOT MODIFY THIS FILE!
    This is a template, make a copy and rename it to config.js
 */

/**
 * @typedef {Object} ConfigStore
 * @property {string} backendUrl
 * @property {string} frontendUrl
 * @property {number} expressPort Express Port Number
 * @property {string} mongoUri MongoDB Connect URI
 * @property {string} cookieSecret Secret for cookie validation
 * @property {Object} mailConfig Nodemailer Config
 * @property {string} mailSender Email sender
 * @property {boolean} skipEmailVerification
 * @property {boolean} useCors
 */

/** @type {ConfigStore} */
const development = {
  backendUrl: 'http://localhost:3000',
  frontendUrl: 'http://localhost:8080',
  expressPort: 3000,
  //podmienic na template
  mongoUri: 'mongodb+srv://tas:tas@cluster0-hh9pd.mongodb.net/tas?retryWrites=true&w=majority',
  cookieSecret: 'secret!',
  mailConfig: {},
  mailSender: 'Test <test@test.com>',
  skipEmailVerification: true,
  useCors: false
}

const configStore = {
  // production,
  // test,
  development
}

/** @type {ConfigStore} */
const selectedConfig = configStore[ENV]
if (!selectedConfig) throw new Error(`Selected config ${ENV} does not exist`)
Object.freeze(selectedConfig)

module.exports = selectedConfig
