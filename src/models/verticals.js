const fetch = require('./')

function get (query) {
  return fetch(process.env.MM_API_1 + '/api/v1/verticals', {query})
}

function getOne (id) {
  return fetch(process.env.MM_API_1 + '/api/v1/verticals' + id)
}

module.exports = {
  get,
  getOne
}
