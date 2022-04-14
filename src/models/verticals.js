const getConfig = require('./get-config')

module.exports = {
  get: function () {
    return getConfig('/api/v1/verticals', process.env.MM_API_1, {all: true})
  },
  getOne: function (id) {
    return getConfig('/api/v1/verticals/' + id, process.env.MM_API_1)
  }
}
