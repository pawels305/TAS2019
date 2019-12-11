// @ts-check
const mongoose = require('mongoose')

const config = require('./config.template')
const app = require('./app')

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(async () => {
  app.listen(config.expressPort, () => {
    console.log(`Server is listening on port ${config.expressPort}`)
  })
}).catch((error) => {
  console.log('Error occured while initializing server')
  console.error(error)
  process.exit()
})
