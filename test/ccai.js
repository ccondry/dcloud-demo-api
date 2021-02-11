require('dotenv').config()
const tokens = require('../src/models/tokens')
const cce = require('../src/models/cce')
const ccai = require('../src/models/ccai')

// get cloud connect details for a given call type ID
async function getCcaiInfo (id) {
  try {
    // get ID from URL parameter or URL query parameter
    // console.log('getting call type info for', id, '...')
    // get call type info from ID, from PCCE
    const callType = await cce.get('callType', id)
    // console.log('got call type:', callType)

    // wait for initial cloud connect access token to be generated
    await Promise.resolve(tokens.cloudConnect.init)
    // get access token from cloud connect
    const token = tokens.cloudConnect.get()
    // get CCAI info from control hub
    const ret = await ccai.getConfig({
      id: callType.ccaiConfigID,
      token
    })
    console.log(ret)
    return ret
  } catch (e) {
    console.log(e)
  }
}

getCcaiInfo(5081)

// require('dotenv').config()

// const fetch = require('node-fetch')
// const https = require('https')


// const url = 'https://ccedata.dcloud.cisco.com/unifiedconfig/config/calltype/5081'
// // const basic = 'YWRtaW5pc3RyYXRvckBkY2xvdWQuY2lzY28uY29tOkMxc2NvMTIzNDU='
// const username = process.env.CCE_USERNAME || 'administrator@dcloud.cisco.com'
// const password = process.env.CCE_PASSWORD || 'C1sco12345'
// const basic = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64')
// const options = {
//   headers: {
//     Authorization: 'Basic ' + basic,
//     Accept: 'application/json'
//   },
//   // build insecure HTTPS client to ignore certs
//   agent: new https.Agent({rejectUnauthorized: false})
// }
// fetch(url, options)
// .then(r => r.text())
// .then(t => console.log(JSON.parse(t).ccaiConfigID))
// .catch(e => console.log(e))