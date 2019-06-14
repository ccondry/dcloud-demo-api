const express = require('express')
const router = express.Router()
const redundantRequest = require('../models/redundant-request')

// create short link
router.get('/', async (req, res, next) => {
  try {
    console.log('request to create short link:', req.query)
    const response = await redundantRequest({
      url: '/api/v1/link',
      method: 'POST',
      body: {
        url: req.query.url
      },
      json: true
    }, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.error('failed to create short link:', e.message)
    if (e.statusCode) {
      return res.status(e.statusCode).send(e.message)
    } else {
      return res.status(500).send(e.message)
    }
  }
})

module.exports = router
