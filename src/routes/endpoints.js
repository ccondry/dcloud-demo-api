const express = require('express')
const router = express.Router()

// get REST endpoint URLs
router.get('/', async function (req, res, next) {
  // const username = req.user.username
  const clientIp = req.clientIp
  const method = req.method
  const host = req.get('host')
  const path = req.originalUrl
  const url = req.protocol + '://' + host + path
  const operation = 'get endpoints'

  console.log('user', 'at IP', req.clientIp, operation, method, path, 'requested')
  let endpoints
  if (process.env.NODE_ENV === 'production') {
    endpoints = {
      configure: '/api/v1/configure',
      session: '/api/v1/session',
      upstream: '/api/v1/upstream'
    }
  } else {
    endpoints = {
      configure: 'http://localhost:3022/api/v1/configure',
      session: 'http://localhost:3022/api/v1/session',
      upstream: 'http://localhost:3022/api/v1/upstream'
    }
  }

  try {
    // get meta info about the response
    let dataType
    let dataLength
    if (Array.isArray(endpoints)) {
      // array
      dataType = 'array'
      dataLength = endpoints.length
    } else {
      // object
      dataType = 'object'
      dataLength = Object.keys(endpoints).length
    }

    // return HTTP response
    res.status(200).send(endpoints)
    // log it to db
    // logger.log({clientIp, host, path, url, method, operation, status: 200, details: 'get endpoints successful', response: `(JSON ${dataType} with ${dataLength} properties)`})
  } catch (error) {
    console.log('user', 'at IP', req.clientIp, 'get endpoints', 'error', error.message)
    // return both error messages
    res.status(500).send(error.message)
    // log error to db
    // logger.log({level: 'error', clientIp, host, path, url, method, operation, status: 500, details: 'get endpoints failed', response: error.message})
  }
})

module.exports = router
