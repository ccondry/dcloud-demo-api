const fetch = require('./fetch')

module.exports = {
  async get (id, token) {
    const url = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/auth/gcp/credentials/' + id
    const options = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
    return fetch(url, options)
  }
}