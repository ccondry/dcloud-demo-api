const express = require('express')
const router = express.Router()
const redundantRequest = require('../models/redundant-request')

// send SMS
router.post('/', async (req, res, next) => {
  try {
    console.log('request to create send SMS - query =', req.query)
    console.log('request to create send SMS - body =', req.body)
    const response = await redundantRequest({
      url: '/api/v1/sms',
      method: 'POST',
      body: {
        to: req.query.to || req.body.to,
        body: req.query.body || req.body.body || req.query.message || req.body.message,
      },
      json: true
    }, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.error('failed to send SMS:', e.message)
    console.error('failed to send SMS, request query was:', e.message)
    return res.status(500).send(e.message)
  }
})

// request to look up if number is mobile
router.get('/lookup/:phone', async function (req, res, next) {
  try {
    console.log('request to lookup phone number info:', req.params.phone)
    const response = await redundantRequest({
      url: '/api/v1/sms/lookup/' + req.params.phone,
      method: 'GET',
      json: true
    }, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.error('failed to send SMS:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
