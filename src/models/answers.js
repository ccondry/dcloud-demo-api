const fetch = require('./fetch')

async function get (id) {
  const response1 = fetch(process.env.CS_MANAGER_API_1 + '/api/v1/answers/' + id)
  const response2 = fetch(process.env.CS_MANAGER_API_2 + '/api/v1/answers/' + id)
  return Promise.any([response1, response2])
}

module.exports = {
  get
}
