const express = require('express')
const bodyParser = require('body-parser')
const { error } = require('./common/response')
const authMiddleware = require('./common/middleware/auth.middleware')
const userRoute = require('./route/user.route')
const authRoute = require('./route/auth.route')
const listingRoute = require('./route/listing.route')
const matchRoute = require('./route/match.route')

const app = express()

app.set('x-powered-by', 'GetZorba')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(authMiddleware)

app.use(userRoute)
app.use(authRoute)
app.use(listingRoute)
app.use(matchRoute)

app.use('*', function (req, res) {
  error(res, 'UnknownPath')
})

app.use((err, req, res, next) => {
  if (res.headersSent) return next()
  if (err instanceof SyntaxError) {
    error(res, 'IncorrectRequest', {}, err)
  } else {
    console.log(err)
    error(res, 'InternalError', {}, err)
  }
})

module.exports = app
