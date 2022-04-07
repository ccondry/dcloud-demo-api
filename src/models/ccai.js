const https = require('https')
const fetch = require('./fetch')

// build insecure HTTPS client to ignore certs
const agent = new https.Agent({
  rejectUnauthorized: false,
})

const orgId = process.env.CLOUD_CONNECT_ORG_ID || '3bf70069-9149-4471-91eb-0dd2371ec2e2'

// get cloud connect config info for given ID
async function getConfig ({token, id}) {
  const url = 'https://config-gateway.produs1.ciscoccservice.com/cms/api/auxiliary-data/resources/ccai-config/' + id
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
