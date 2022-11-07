const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const MatchSchema = new mongoose.Schema({
  listing: { type: ObjectId, ref: 'Listing' },
  user: { type: ObjectId, ref: 'User' }
})

MatchSchema.index(
  { listing: 1, user: 1 },
  { name: 'listingUserIndex', unique: true }
)

module.exports.MatchModel = mongoose.model('Match', MatchSchema)
