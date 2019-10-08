const mongoose = require('mongoose')
const config = require('../src/config')
const { initializeModules } = require('../src/modules')

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  initializeModules({
    advertise: true
  })
})
