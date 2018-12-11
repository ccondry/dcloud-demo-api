const getConfig = require('./get-config')

module.exports = {
  get: function () {
    return getConfig('/api/v1/answers')
  }
}
