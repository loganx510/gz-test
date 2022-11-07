const express = require('express')
const sha1 = require('sha1')
const { v4: uuid } = require('uuid')
const { ok, error } = require('../common/response')
const required = require('../common/middleware/required.middleware')
const validator = require('../common/middleware/validator.middleware')

const {
  UserModel,
  emailValidator,
  passwordValidator
} = require('../model/user.model')
const { TokenModel } = require('../model/token.model')

const authRoute = express.Router()

authRoute.post(
  '/auth',
  required(['email', 'password']),
  validator({
    email: emailValidator,
    password: passwordValidator
  }),
  async (req, res, next) => {
    const user = await UserModel.findOne({
      email: req.body.email.toLowerCase().trim(),
      password: sha1(req.body.password + process.env.SALT)
    })
    if (!user) {
      return error(res, {
        type: 'LoginFailed'
      })
    }
    const newToken = new TokenModel({
      uuid: uuid(),
      user: user._id
    })
    try {
      await newToken.save()
      ok(res, { token: newToken.uuid })
    } catch (e) {
      next(e)
    }
  }
)

authRoute.delete('/auth', async (req, res, next) => {
  if (req.user) {
    try {
      await TokenModel.deleteOne({ uuid: req.user.tokenId })
    } catch (error) {
      return next(error)
    }
  }
  ok(res)
})

module.exports = authRoute
