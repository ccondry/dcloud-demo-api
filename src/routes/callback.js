const express = require('express')
const router = express.Router()
const cb = require('../models/callback.js')

router.post('/', async (req, res) => {
  try {
    const rsp = await cb(req.body)
    return res.status(200).send(rsp)
  } catch (error) {
    console.log('failed to start UCCX callback', error.message)
    return res.status(500).send(error.message)
  }
})

module.exports = router
