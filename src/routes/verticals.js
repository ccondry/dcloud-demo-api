const express = require('express')
const router = express.Router()
const model = require('../models/verticals')

// get current demo configuration from mm or mm-dev
router.get('/', async (req, res, next) => {
  try {
    console.log('request to get demo verticals list')
    // get session config
    const verticals = await model.get()
    return res.status(200).send(verticals)
  } catch (e) {
    // failed
    console.error('failed to get dCloud demo verticals list:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
