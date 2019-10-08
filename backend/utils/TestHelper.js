const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

class DbHelper {
  constructor () {
    this.uri = null
    this.server = new MongoMemoryServer()
  }

  async start () {
    this.uri = await this.server.getConnectionString()
    await mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }, (err) => {
      if (err) console.error(err)
    })
  }

  async stop () {
    await mongoose.disconnect()
    await this.server.stop()
  }
}

module.exports.DbHelper = DbHelper
