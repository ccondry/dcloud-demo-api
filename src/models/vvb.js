const client = require('vvb-client')

const url = process.env.VVB_URL || 'https://vvb1.dcloud.cisco.com'
const username = process.env.VVB_USERNAME || 'administrator'
const password = process.env.VVB_PASSWORD || 'dCloud!23'

const vvb = new client({
  url,
  username,
  password
})

module.exports = vvb