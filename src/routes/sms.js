const express = require('express')
const router = express.Router()
const redundantRequest = require('../models/redundant-request')

// send SMS
router.post('/', async (req, res, next) => {
  try {
    console.log('request to create short link')
    const response = redundantRequest({
      url: '/api/v1/sms',
      method: 'POST',
      body: {
        to: req.body.to,
        body: req.body.body
      },
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
