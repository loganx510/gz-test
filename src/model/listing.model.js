const mongoose = require('mongoose')
const validate = require('mongoose-validator')

const ObjectId = mongoose.Schema.Types.ObjectId

const priceValidator = [
  validate({
    validator: 'isCurrency',
    arguments: {
      allow_negatives: false
    },
    message: 'PriceShouldBePositiveNumber'
  })
]

const feeValidator = [
  validate({
    validator: 'isCurrency',
    arguments: {
      allow_negatives: false
    },
    message: 'FeeShouldBePositiveNumber'
  })
]

const photoUrlValidator = [
  validate({
    validator: 'isURL',
    message: 'PhotoShouldBeValidUrl'
  })
]

const coverPhotoValidator = [
  validate({
    validator: 'isURL',
    message: 'CoverPhotoShouldBeValidUrl'
  })
]

const addressValidator = [
  validate({
    validator: 'matches',
    arguments: /^[a-zA-Z0-9\s,'-]*$/i,
    message: 'AddressShouldBeValid'
  })
]

const slugValidator = [
  validate({
    validator: 'matches',
    arguments: /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/i,
    message: 'SlugShouldBeValid'
  })
]

const ListingSchema = new mongoose.Schema({
  address: { type: String, required: true, validate: addressValidator },
  slug: { type: String, required: true, validate: slugValidator },
  price: { type: Number, required: true },
  fee: { type: Number, required: true },
  photos: { type: [String], default: [] },
  coverPhoto: { type: String, required: true, validate: coverPhotoValidator },
  user: { type: ObjectId, ref: 'User' }
})

ListingSchema.index({ slug: 1 }, { name: 'slugIndex', unique: true })

module.exports.ListingModel = mongoose.model('Listing', ListingSchema)
module.exports.priceValidator = priceValidator
module.exports.photoUrlValidator = photoUrlValidator
module.exports.addressValidator = addressValidator
module.exports.slugValidator = slugValidator
module.exports.feeValidator = feeValidator
module.exports.coverPhotoValidator = coverPhotoValidator
