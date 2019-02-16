const express = require('express')
const router = express.Router()
const redundantRequest = require('../models/redundant-request')

// duo auth - forward to cs-manager server pair
router.use('/auth', async (req, res, next) => {
  try {
    console.log('request to', req.method, req.path, ' - send Duo Security request. query:', req.query)
    const response = redundantRequest({
      url: '/api/v1/duo/auth',
      method: req.method,
      qs: req.query,
      json: true
    }, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.error('failed to', req.method, req.path, ' - send Duo Security request. query:', req.query)
    return res.status(500).send(e.message)
  }
})

module.exports = router
