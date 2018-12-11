const getConfig = require('./get-config')

module.exports = {
  get: function () {
    return getConfig('/api/v1/answers', process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
  }
}
