const fetch = require('./fetch')

module.exports = {
  async get ({owner, projectId, privateKeyId}) {
    const url = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/auth/gcp/credentials/' + projectId
    const options = {
      headers: {
        Authorization: 'Bearer ' + privateKeyId
      },
      query: {owner}
    }
    return fetch(url, options)
  }
}