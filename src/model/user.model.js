const mongoose = require('mongoose')
const validate = require('mongoose-validator')

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'EmailShouldBeValid'
  })
]

const passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 30],
    message: 'PasswordLengthShouldBe[6-30]'
  })
]

const phoneValidator = [
  validate({
    validator: 'isMobilePhone',
    message: 'PhoneShouldBeValid'
  })
]

const userTypeValidator = [
  validate({
    validator: value => {
      return ['admin', 'seller', 'buyer'].includes(value)
    },
    message: 'UserTypeShouldBeValid'
  })
]

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, validate: emailValidator },
  password: { type: String, required: true },
  phone: { type: String, required: true, validate: phoneValidator },
  type: { type: String, required: true, validate: userTypeValidator }
})

UserSchema.index(
  { email: 1, password: 1 },
  { name: 'emailPasswordIndex', unique: true }
)

module.exports.UserModel = mongoose.model('User', UserSchema)
module.exports.emailValidator = emailValidator
module.exports.passwordValidator = passwordValidator
module.exports.phoneValidator = phoneValidator
module.exports.userTypeValidator = userTypeValidator
