const express = require('express')
const router = express.Router()
const session = require('../models/session')
const cumulus = require('../models/cumulus')

router.get('/', async (req, res, next) => {
  console.log('request to get session data')
  try {
    // get parsed session.xml as json object
    const json = await session.get()
    // get local per-user config, if exists
    try {
      if (req.query.username) {
        console.log('getting session configuration for', req.query.username)
        const configuration = await cumulus.getConfig(req.query.username)
        json.configuration = configuration
      }
    } catch (e) {
      // continue
    }
    // return data
    return res.status(200).send(json)
  } catch (e) {
    console.error('failed to get session data', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
