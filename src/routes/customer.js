const express = require('express')
const router = express.Router()
const DB = require('../models/mongodb')
const db = new DB('toolbox')
// const logger = require('../models/logger')

// get customer registered to this demo session
router.get('/:contact', getCustomer)
router.get('/', getCustomer)

async function getCustomer (req, res) {
  // prepare log data for log object
  const clientIp = req.clientIp
  const method = req.method
  const host = req.get('host')
  const path = req.originalUrl
  const url = req.protocol + '://' + host + path
  const query = req.query || {}
  const params = req.params || {}
  const operation = 'get customer'

  console.log('client at IP', clientIp, 'requested', operation)

  // // validate token
  // try {
  //   await tokens.get({token, type: 'customer', grant: 'exists'})
  //   // console.log('validToken', validToken)
  // } catch (e) {
  //   // invalid token
  //   const details = 'Failed to validate authorization token: ' + e.message
  //   // log it to db
  //   // logger.log({clientIp, host, path, url, method, operation, status: 403, details, query, params})
  //   console.log(details)
  //   // return 403 UNAUTHORIZED
  //   return res.status(403).send(details)
  // }

  // get data from params
  const contact = params.contact || query.contact

  // validate data
  if (!contact) {
    const details = '"contact" is a required parameter in the URL or query string.'
    console.log('client at IP', clientIp, 'failed', operation, ':', details)
    // log it to db
    // logger.log({clientIp, host, path, url, method, operation, status: 400, details, query, params})
    // return 400 BAD_REQUEST
    return res.status(400).send(details)
  }

  try {
    // get customer routing information for contact
    // const projection = {_id: 0}
    const results = await db.findOne('routing', {contact}, {_id: 0})
    if (results) {
      // contact point is registered
      console.log(operation, 'successful:', results)
      // return 200 OK with data
      return res.status(200).send(results)
    } else {
      // not registered
      console.log(operation, 'successful, but no customer found. Returning 404. contact was', contact)
      // return 404 NOT_FOUND
      return res.status(404).send('no customer found matching your query')
    }
  } catch (e) {
    // error
    console.error('failed to', operation, e.message)
    // log it to db
    // logger.log({clientIp, host, path, url, method, operation, status: e.statusCode, details: e.message, query, params})
    // return status sent by hydra
    return res.status(500).send(e.message)
  }
}

// register a customer for an instant demo user
router.post('/', async function (req, res) {
  // prepare log data for log object
  const clientIp = req.clientIp
  const method = req.method
  const host = req.get('host')
  const path = req.originalUrl
  const url = req.protocol + '://' + host + path
  const operation = 'register customer'
  const query = req.query
  const body = req.body

  console.log('client at IP', req.clientIp, 'requested', operation)

  // get data from query or from body
  const userId = body.userId || query.userId
  const contact = body.contact || query.contact

  // validate data
  if (!userId || !contact) {
    const details = '"contact" and "userId" are required parameters.'
    // log it to db
    // logger.log({clientIp, host, path, url, method, operation, status: 400, details, query, body})
    // return 400 BAD_REQUEST
    return res.status(400).send(details)
  }

  // remove _id if present
  delete req.body._id

  try {
    // add customer routing information into database
    await db.insert('routing', {userId, contact})
    // respond 201 CREATED
    return res.status(201).send()
  } catch (e) {
    // error
    console.error('failed to', operation, e.message)
    // log it to db
    // logger.log({clientIp, host, path, url, method, operation, status: e.statusCode, details: e.message, query, body})
    if (e.name === 'MongoError' && e.code === 11000) {
      // duplicate key error
      return res.status(409).send('That contact is already registered.')
    }
    // return status sent by hydra
    return res.status(e.statusCode).send(e.message)
  }
})

module.exports = router
