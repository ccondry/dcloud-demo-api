const express = require('express')
const router = express.Router()
const redundantRequest = require('../models/redundant-request')

// send SMS
router.post('/', async (req, res, next) => {
  try {
    console.log('request to create send WhatsApp message:', req.query)
    const response = await redundantRequest({
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
    if (e.statusCode) {
      return res.status(e.statusCode).send(e.message)
    } else {
      return res.status(500).send(e.message)
    }
  }
})

// request to look up if number is mobile
router.get('/lookup/:phone', async function (req, res, next) {
  try {
    console.log('request to lookup phone number info:', req.params.phone)
    const response = await redundantRequest({
      url: '/api/v1/whatsapp/lookup/' + req.params.phone,
      method: 'GET',
      json: true
    }, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.error('failed to send SMS:', e.message)
    if (e.statusCode) {
      return res.status(e.statusCode).send(e.message)
    } else {
      return res.status(500).send(e.message)
    }
  }
})

module.exports = router
