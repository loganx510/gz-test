const { TokenModel } = require('../../model/token.model')

/**
 * Auth middleware checks for the token in headers,
 * looks it up in the DB and adds user information to the request object
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} res - Express next middleware function in the stack
 */

module.exports = async function (req, res, next) {
  if (req.headers.token && req.headers.token.length > 0) {
    const token = await TokenModel.findOne({ uuid: req.headers.token })
      .populate('user')
      .exec()
    if (token) {
      req.user = {
        userId: token.user.id,
        tokenId: token.uuid,
        type: token.user.type
      }
    } else {
      req.user = null
    }
  }
  next()
}
