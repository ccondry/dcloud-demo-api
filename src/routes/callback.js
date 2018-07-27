const express = require('express')
const router = express.Router()
const uccxCallback = require('../models/uccx/callback.js')

router.post('/', async (req, res) => {
  try {
    console.log('request for UCCX voice callback. request body:', req.body)
    const rsp = await uccxCallback(req.body)
    return res.status(200).send(rsp)
  } catch (error) {
    console.log('failed to start UCCX callback', error.message)
    return res.status(500).send(error.message)
  }
})

module.exports = router
