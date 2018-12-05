const request = require('request-promise-native')

async function getConfig () {
  // url path
  const url = `/api/v1/verticals`

  const options = {
    baseUrl: process.env.MM_API_1,
    url,
    json: true
  }

  let response
  try {
    // get session config from mm
    return await request(options)
  } catch (e) {
    console.log('failed to get verticals list from', process.env.MM_API_1, e.message)
    try {
      // get session config from mm-dev
      options.baseUrl = process.env.MM_API_2
      return await request(options)
    } catch (e2) {
      console.log('failed to get verticals list from', process.env.MM_API_2, e2.message)
      // failed both
      throw e2
    }
  }
}

module.exports = {
  get: getConfig
}
