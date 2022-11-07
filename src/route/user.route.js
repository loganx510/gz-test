const express = require('express')
const sha1 = require('sha1')
const { ok, error } = require('../common/response')
const required = require('../common/middleware/required.middleware')
const validator = require('../common/middleware/validator.middleware')
const {
  UserModel,
  emailValidator,
  passwordValidator,
  phoneValidator,
  userTypeValidator
} = require('../model/user.model')

const userRoute = express.Router()

userRoute.post(
  '/user',
  required(['email', 'password', 'phone', 'type']),
  validator({
    email: emailValidator,
    password: passwordValidator,
    phone: phoneValidator,
    type: userTypeValidator
  }),
  async (req, res, next) => {
    const newUser = new UserModel({
      email: req.body.email.toLowerCase().trim(),
      password: sha1(req.body.password + process.env.SALT),
      phone: req.body.phone,
      type: req.body.type
    })
    try {
      await newUser.save()
      ok(res, { id: newUser._id })
    } catch (e) {
      e.code === 11001 || e.code === 11000 ? error(res, 'UserExists') : next(e)
    }
  }
)

module.exports = userRoute
