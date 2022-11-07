const mongoose = require('mongoose')
const app = require('./src/app')

process.on('unhandledRejection', error => {
  console.log(error)
  process.exit(1)
})

async function run () {
  mongoose.Promise = global.Promise
  try {
    await mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true })
    app.listen(8080)
    console.log('Started')
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

run()
