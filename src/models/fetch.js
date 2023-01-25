const fetch = require('node-fetch')

module.exports = async function (url, options = {}) {
  // set default headers
  options.headers = options.headers || {}
  options.headers.Accept = options.headers.Accept || 'application/json'
  // set content type defaults for POST and PUT
  try {
    if (['post', 'put', 'patch'].includes(options.method.toLowerCase())) {
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json'
    }
  } catch (e) {
    // continue
  }
  // stringify JSON body
  if (
    options.headers['Content-Type'] === 'application/json' &&
    typeof options.body === 'object'
  ) {
    options.body = JSON.stringify(options.body)
  }
  // add query to url
  let urlWithQuery = url
  // console.log('options.query', options.query)
  if (typeof options.query === 'object') {
    const keys = Object.keys(options.query)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = options.query[key]
      if (i === 0) {
        urlWithQuery += '?'
      } else {
        urlWithQuery += '&'
      }
      urlWithQuery += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    }
  }
  // console.log('getting', urlWithQuery)
  // go
  const response = await fetch(urlWithQuery, options)
  // parse response to JSON
  let data = await response.text()
  // if (response.headers['content-type'] === 'application/json') {
  try {
    data = JSON.parse(data)
  } catch (e) {
    // continue
  }
  // check status is OK
  if (response.ok) {
    return data
  } else {
    const message = data.message || data
    const error = Error(`${response.status} ${response.statusText} - ${message}`)
    error.status = response.status
    error.statusText = response.statusText
    error.response = response
    throw error
  }
}