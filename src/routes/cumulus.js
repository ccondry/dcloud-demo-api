const express = require('express')
const router = express.Router()
const session = require('../models/session.js')

// forward client to cumulus website
router.get('/', async (req, res, next) => {
  try {
    // parse session.xml to json object
    const json = await session.get()
    // extract relevant data
    // determine if we should redirect to the secondary server or primary server
    const host = req.query.dev === 'true' ? process.env.MM_API_2 : process.env.MM_API_1
    // redirect client with 302
    return res.redirect(302, `${host}?session=${json.session.id}&datacenter=${json.session.datacenter}`)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e.message)
  }
})

module.exports = router
