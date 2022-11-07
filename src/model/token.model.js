const mongoose = require('mongoose')
const validate = require('mongoose-validator')

const ObjectId = mongoose.Schema.Types.ObjectId

const tokenUuidValidator = [
  validate({
    validator: 'isUUID',
    message: 'UuidShouldBeValid'
  })
]

const TokenSchema = new mongoose.Schema({
  uuid: { type: String, required: true, validate: tokenUuidValidator },
  user: { type: ObjectId, ref: 'User' }
})

TokenSchema.index({ uuid: 1 }, { name: 'uuidIndex', unique: true })

module.exports.TokenModel = mongoose.model('Token', TokenSchema)
module.exports.tokenUuidValidator = tokenUuidValidator
