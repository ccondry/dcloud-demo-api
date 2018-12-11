const request = require('request-promise-native')

// try 2 servers for getting data

// get data from primary baseUrl1, and fall back to baseUrl2 if there is an error
async function redundantGet (url, baseUrl1, baseUrl2) {
  const options = {
    baseUrl: baseUrl1,
    url,
    qs: {
      all: true
    },
    json: true
  }

  let response
  try {
    // get session config from primary
    return await request(options)
  } catch (e) {
    console.log('failed to get verticals list from', baseUrl1, e.message)
    try {
      // get session config from secondary
      options.baseUrl = baseUrl2
      return await request(options)
    } catch (e2) {
      console.log('failed to get verticals list from', baseUrl2, e2.message)
      // failed both
      throw e2
    }
  }
}

module.exports = redundantGet
