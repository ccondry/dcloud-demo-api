const express = require('express')
const router = express.Router()
const configure = require('../models/configure')

router.get('/', async (req, res, next) => {
  try {
    console.log('request to configure demo')
    // patch session on mm and mm-dev
    const message = await configure(req.query)
    return res.status(200).send(message)
  } catch (e) {
    // failed
    console.error('failed to update dCloud demo session configuration:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
