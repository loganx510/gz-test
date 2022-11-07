const { error } = require('../response')

/**
 * Express middleware checks for the required params
 * in the method payload
 *
 * @param {[string]} fields - Array of required params
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} res - Express next middleware function in the stack
 */

module.exports = fields => {
  return function (req, res, next) {
    for (const field of fields) {
      if (!Object.prototype.hasOwnProperty.call(req.body, field)) {
        error(res, {
          type: field,
          code: 'RequiredParamMissing'
        })
        return next('RequestValidationError')
      }
    }
    next()
  }
}
