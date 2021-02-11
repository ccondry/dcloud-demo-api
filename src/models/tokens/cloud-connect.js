const https = require('https')
const fetch = require('../fetch')

let cache = {}

// build insecure HTTPS client to ignore certs
const agent = new https.Agent({
  rejectUnauthorized: false,
})

// build REST request options for getting cloud connect OAUTH2 token
const host = process.env.CLOUD_CONNECT_HOST || 'cloudconnect1.dcloud.cisco.com:8445'
const url = 'https://' + host + '/cloudconnectmgmt/token'

const username = process.env.CLOUD_CONNECT_USERNAME || 'administrator'
const password = process.env.CLOUD_CONNECT_PASSWORD || 'C1sco12345'
const basic = Buffer.from(username + ':' + password, 'utf-8').toString('base64')

const options = {
  query: {
    scopes: 'cjp-ccai:read'
  },
  headers: {
    Authorization: 'Basic ' + basic,
    Accept: 'application/json'
  },
  agent
}

// get cached OAUTH2 token for control hub
function get () {
  return cache.access_token
}

// update cached token
async function refresh () {
  if (cache.refresh_token) {
    // TODO try to use refresh token instead of creating a new one?
    // or maybe just creating a new one every 16 hours isn't so bad
  }
  // replace token in cache
  cache = await fetch(url, options)
  // add current timestamp
  cache.modified = (new Date()).getTime()
}

// refresh at service start
const init = refresh()

async function checkExpiration () {
  // validate cache parameters exist
  if (!cache.modified || !cache.expires_in) {
    // refreshing should fix that
    return refresh()
  }
  // expiry time of token in cache. modified is ms while expires_in is seconds
  const expires = new Date()
  expires.setTime(cache.modified + (cache.expires_in * 1000))
  const now = new Date()
  // get difference
  const diff = now.getTime() - expires.getTime()
  // is expiration less than 2 hours away?
  if (diff <= 1000 * 60 * 60 * 2) {
    // time to refresh access token
    return refresh()
  }
}

// check token expiration every 30 minutes
setInterval(function () {
  checkExpiration()
}, 1000 * 60 * 30)

module.exports = {
  get,
  init
}