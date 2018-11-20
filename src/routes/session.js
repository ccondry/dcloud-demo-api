const express = require('express')
const router = express.Router()
const session = require('../models/session')

router.get('/', async (req, res, next) => {
  console.log('request to get session data')
  try {
    // parse session.xml to json object
    const json = await session.get()
    // return data
    return res.status(200).send(json.session)
  } catch (e) {
    console.error('failed to get session data', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
