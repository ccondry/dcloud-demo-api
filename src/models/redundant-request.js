const request = require('request-promise-native')

// try 2 servers
// get data from primary baseUrl1, and fall back to baseUrl2 if there is an error
async function redundantRequest (options, baseUrl1, baseUrl2) {
  try {
    // get session config from primary
    options.baseUrl = baseUrl1
    return await request(options)
  } catch (e) {
    console.log('failed request to', baseUrl1, e.message)
    try {
      // get session config from secondary
      options.baseUrl = baseUrl2
      return await request(options)
    } catch (e2) {
      console.log('failed request to', baseUrl2, e2.message)
      // failed both - rethrow first error
      throw e
    }
  }
}

module.exports = redundantRequest
