// @ts-check
const express = require('express')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const cors = require('cors')
const path = require('path')

const config = require('./config')
const router = require('./routes')

var bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json({ limit: '10mb' }))

if (config.useCors) {
  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true
    })
  )
}

app.use(session({
  // @ts-ignore
  store: new SQLiteStore({
    db: 'sessions.db'
  }),
  secret: config.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
}))

app.use(express.json())
app.disable('x-powered-by')

app.use('/api', router)
app.use('/static', express.static(path.join(__dirname, '/../public')))

module.exports = app
