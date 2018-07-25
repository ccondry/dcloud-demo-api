const request = require('request-promise-native')
const queryString = require('query-string')
const URL = require('url-parse')
require('dotenv').load()

async function go () {
  const body = {
    firstname: 'coty',
    lastname: 'coty',
    callback: '912142336226',
    submit: ''
  }
  console.log('trying to start UCCX callback...')
  const rsp = await request({
    url: process.env.UCCX_CALLBACK_API_URL,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: queryString.stringify(body),
    resolveWithFullResponse: true,
    simple: false
  })
  console.log('UCCX callback request accepted. parsing return data...')
  const url = new URL(rsp.headers.location)
  console.log('UCCX callback request location returned:', url)
  // check for UCCX returning error
  if (url.pathname === process.env.UCCX_CALLBACK_FAIL_URL) {
    // error
    throw ('callback failed. check callback number and try again.')
  } else {
    // successful ?
    const qs = queryString.parse(url.query)
    console.log('UCCX callback success - qs:', qs)
    return qs
  }
}

go().then(result => {
  console.log('success', result)
}).catch(e => {
  console.error('error', e)
})
