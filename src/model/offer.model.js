const mongoose = require('mongoose')
const validate = require('mongoose-validator')
const { parseISO, differenceInHours } = require('date-fns')
const ObjectId = mongoose.Schema.Types.ObjectId

const expirationDateValidator = [
  validate({
    validator: value => {
      const parsedIsoDate = parseISO(value)
      return parsedIsoDate instanceof Date && !isNaN(parsedIsoDate)
    },
    message: 'ExpirationDateShouldBeValid'
  }),
  validate({
    validator: value => {
      const parsedIsoDate = parseISO(value)
      const hoursFromNow = differenceInHours(parsedIsoDate, new Date())
      return hoursFromNow > 24
    },
    message: 'ExpirationDateShouldBeMoreThan24Hrs'
  }),
  validate({
    validator: value => {
      const parsedIsoDate = parseISO(value)
      const hoursFromNow = differenceInHours(parsedIsoDate, new Date())
      return hoursFromNow < 24 * 7
    },
    message: 'ExpirationDateShouldBeLessThan1Week'
  })
]

const paymentTypeValidator = [
  validate({
    validator: value => {
      return ['cash', 'financing'].includes(value)
    },
    message: 'PaymentTypeShouldBeValid'
  })
]

const offerPriceValidator = [
  validate({
    validator: 'isCurrency',
    arguments: {
      allow_negatives: false
    },
    message: 'OfferPriceShouldBePositiveNumber'
  })
]

const OfferSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  paymentType: { type: String, required: true, validate: paymentTypeValidator },
  expirationDate: { type: Date },
  match: { type: ObjectId, ref: 'Match' },
  user: { type: ObjectId, ref: 'User' }
})

module.exports.OfferModel = mongoose.model('Offer', OfferSchema)
module.exports.offerPriceValidator = offerPriceValidator
module.exports.paymentTypeValidator = paymentTypeValidator
module.exports.expirationDateValidator = expirationDateValidator
