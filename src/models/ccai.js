const https = require('https')
const fetch = require('./fetch')

// build insecure HTTPS client to ignore certs
const agent = new https.Agent({
  rejectUnauthorized: false,
})

const orgId = process.env.CLOUD_CONNECT_ORG_ID || '47764486-9076-4b2c-97a2-03cc809066c6'

// get cloud connect config info for given ID
async function getConfig ({token, id}) {
  const url = 'https://cms.appstaging.ciscoccservice.com/cms/api/auxiliary-data/resources/ccai-config/' + id
  const options = {
    query: {
      scopes: 'cjp-ccai:read'
    },
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'X-ORGANIZATION-ID': orgId
    },
    agent
  }
  return fetch(url, options)
}

module.exports = {
  getConfig 
}
