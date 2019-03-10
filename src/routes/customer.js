const express = require('express')
const router = express.Router()
const db = require('../models/mongodb')
// const logger = require('../models/logger')

// check if a contact point is registered to this demo session as a customer
// contact point = email, phone, FB ID, etc.
router.get('/:contact', async function (req, res) {
  // prepare log data for log object
  const clientIp = req.clientIp
  const method = req.method
  const host = req.get('host')
  const path = req.originalUrl
  const url = req.protocol + '://' + host + path
  const operation = 'get customer'
  const query = req.query
  const params = req.params
  // const body = req.body

  console.log('client at IP', req.clientIp, 'requested', operation)


  try {
    // validate token
    await tokens.get({token, type: 'customer', grant: 'exists'})
    // console.log('validToken', validToken)
  } catch (e) {
    // invalid token
    const details = 'Failed to validate authorization token: ' + e.message
    // log it to db
    // logger.log({clientIp, host, path, url, method, operation, status: 403, details, query, params})
    console.log(details)
    // return 403 UNAUTHORIZED
    return res.status(403).send(details)
  }

  // get data from params
  const contact = req.params.contact

  // validate data
  if (!contact) {
    const details = '"contact" is a required parameter.'
    // log it to db
    // logger.log({clientIp, host, path, url, method, operation, status: 400, details, query, params})
    // return 400 BAD_REQUEST
    return res.status(400).send(details)
  }

  try {
    // get customer routing information for contact
    const results = await db.findOne('routing', {contact})
    let exists
    if (results) {
      // contact point is registered
      exists = true
    } else {
      // not registered
      exists = false
    }
    // error
    console.log(operation, 'successful. exists = ', exists)
    // log it to db
    // logger.log({clientIp, host, path, url, method, operation, status: 200, details: {exists}, query, params})
    // return 200 OK with data
    return res.status(200).send({exists})
  } catch (e) {
    // error
    console.error('failed to', operation, e.message)
    // log it to db
    // logger.log({clientIp, host, path, url, method, operation, status: e.statusCode, details: e.message, query, params})
    // return status sent by hydra
    return res.status(e.statusCode).send(e.message)
  }
})

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
