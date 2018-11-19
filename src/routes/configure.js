const express = require('express')
const router = express.Router()
const model = require('../models/configure')

// get current demo configuration from mm or mm-dev
router.get('/', async (req, res, next) => {
  try {
    console.log('request to get demo configuration')
    // get session config
    const config = await model.get()
    return res.status(200).send(config)
  } catch (e) {
    // failed
    console.error('failed to get dCloud demo session configuration:', e.message)
    return res.status(500).send(e.message)
  }
})

// update demo configuration on mm and mm-dev
router.post('/', async (req, res, next) => {
  try {
    console.log('POST request to configure demo')
    // patch session on mm and mm-dev
    const message = await model.update(req.body)
    return res.status(200).send(message)
  } catch (e) {
    // failed
    console.error('failed to update dCloud demo session configuration:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
