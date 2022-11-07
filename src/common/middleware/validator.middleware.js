const { error } = require('../response')

/**
 * Express middleware validates params
 * using validator function
 *
 * @param {object} validations - Key->Value object, key is a param name and Value is a validation function
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} res - Express next middleware function in the stack
 */

module.exports = validations => {
  return function (req, res, next) {
    const params = Object.keys(validations)
    for (let i = 0; i < params.length; i++) {
      if (validations[params[i]] !== undefined) {
        if (Object.prototype.hasOwnProperty.call(req.body, params[i])) {
          validations[params[i]].forEach(function (validatorStep) {
            if (
              !validatorStep.validator(req.body[params[i]].toString()) &&
              validatorStep.message
            ) {
              error(res, { type: params[i], code: validatorStep.message })
              throw new Error()
            }
          })
        }
      } else {
        throw Error(params[i] + " doen't have correct validator")
      }
    }
    next()
  }
}
