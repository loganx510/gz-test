/**
 * Error response helper adds additional
 * information to the response
 *
 * @param {object} res - Express response object
 * @param {string|object} data - Error code or object
 */

module.exports.error = function (res, data) {
  res.json({
    status: 'error',
    request: {
      method: res.req.method,
      url: `${res.req.protocol}://${res.req.get('host')}${res.req.originalUrl}`,
      ip: res.req.appRemoteAddress,
      body: res.req.body
    },
    data: typeof data === 'string' ? { type: data } : data
  })
}

/**
 * Success response helper adds additional
 * information to the response
 *
 * @param {object} res - Express response object
 * @param {string|object|array} data - Data sent back to the user
 */

module.exports.ok = function (res, data) {
  res.json({
    status: 'ok',
    request: res.req.originalUrl,
    data
  })
}
