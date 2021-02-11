require('dotenv').config()
// build insecure HTTPS client to ignore certs
const https = require('https')

const agent = new https.Agent({
  rejectUnauthorized: false,
})

const fetch = require('../src/models/fetch')

// TODO keep cloud connect auth token available
const url = 'https://cloudconnect1.dcloud.cisco.com:8445/cloudconnectmgmt/token?scopes=cjp-ccai:read'
const basic = Buffer.from('administrator:C1sco12345', 'utf-8').toString('base64')
const options = {
  query: {
    "key": "scopes",
    "value": "cjp-ccai:read"
  },
  headers: {
    Authorization: 'Basic ' + basic
  },
  agent
}

async function main () {
  try {
    const r = await fetch(url, options)
    console.log(r)
  } catch (e) {
    console.log(e)
  }
}

main()