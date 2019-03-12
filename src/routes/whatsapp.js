const express = require('express')
const router = express.Router()
const redundantRequest = require('../models/redundant-request')

// send SMS
router.post('/', async (req, res, next) => {
  try {
    console.log('request to create send WhatsApp message:', req.query)
    const response = redundantRequest({
      url: '/api/v1/whatsapp',
      method: 'POST',
      body: {
        to: req.query.to,
        body: req.query.body
      },
      json: true
    }, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.error('failed to send WhatsApp message:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
