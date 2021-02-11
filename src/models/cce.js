const https = require('https')
const fetch = require('./fetch')

// build insecure HTTPS client to ignore certs
const agent = new https.Agent({
  rejectUnauthorized: false,
})

async function get (type, id) {
  const host = process.env.CCE_HOST || 'ccedata.dcloud.cisco.com'
  const url = 'https://' + host + '/unifiedconfig/config/' + type + '/' + id
  const username = process.env.CCE_USERNAME || 'administrator@dcloud.cisco.com'
  const password = process.env.CCE_PASSWORD || 'C1sco12345'
  const basic = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64')
  const options = {
    headers: {
      Authorization: 'Basic ' + basic,
      Accept: 'application/json'
    },
    agent
  }
  console.log('fetch', url, options)
  return fetch(url, options)
}

module.exports = {
  get
}