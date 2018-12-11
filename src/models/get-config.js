const request = require('request-promise-native')

// get data from mm, and fall back to mm-dev if there is an error
async function getConfig (url) {
  const options = {
    baseUrl: process.env.MM_API_1,
    url,
    qs: {
      all: true
    },
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

module.exports = getConfig
