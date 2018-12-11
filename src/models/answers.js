const getConfig = require('./get-config')

module.exports = {
  get: function (id) {
    return getConfig('/api/v1/answers/' + id, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
  }
}
