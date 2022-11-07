const mongoose = require('mongoose')
const { ListingModel } = require('../model/listing.model')
const { MatchModel } = require('../model/match.model')
const { OfferModel } = require('../model/offer.model')
const { TokenModel } = require('../model/token.model')
const { UserModel } = require('../model/user.model')

module.exports.databaseConnect = async function () {
  mongoose.Promise = global.Promise
  await mongoose.connect(
    process.env.DB_HOST.replace('/getzorba', '/getzorba-test'),
    { useNewUrlParser: true }
  )
}

module.exports.databaseDisconnect = async function () {
  if (mongoose.connection.db) {
    await mongoose.connection.close()
  }
}

module.exports.databaseCleanup = async function () {
  await ListingModel.deleteMany({})
  await MatchModel.deleteMany({})
  await OfferModel.deleteMany({})
  await TokenModel.deleteMany({})
  await UserModel.deleteMany({})
}

module.exports.testAsync = fn => {
  return async () => {
    try {
      await fn()
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
