const request = require('request-promise-native')
const queryString = require('query-string')
const URL = require('url-parse')
require('dotenv').load()

module.exports = async function (body) {
  // const body = {
  //   firstname: 'coty',
  //   lastname: 'condry',
  //   callback: '914088951541',
  //   submit: ''
  // }
  console.log('trying to start UCCX callback...')
  const rsp = await request({
    url: process.env.UCCX_CALLBACK_API_URL,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: queryString.stringify(body),
    resolveWithFullResponse: true,
    simple: false
  })
  console.log('UCCX callback response status code', rsp.statusCode)
  if (rsp.statusCode === 302) {
    console.log('UCCX callback request accepted. parsing return data...')
    const url = new URL(rsp.headers.location)
    console.log('UCCX callback request location returned:', url)
    // check for UCCX returning error
    if (url.pathname === process.env.UCCX_CALLBACK_FAIL_URL) {
      // error
      throw Error('callback failed. check callback number and try again.')
    } else {
      // successful ?
      const qs = queryString.parse(url.query)
      console.log('UCCX callback success - qs:', qs)
      return qs
    }
  } else {
    // wrong status code
    throw Error('UCCX server returned status code ' + rsp.statusCode)
  }
}
