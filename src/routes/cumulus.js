const express = require('express')
const router = express.Router()
const session = require('./session.js')

// forward client to cumulus website
router.get('/', async (req, res, next) => {
  try {
    // parse session.xml to json object
    const json = await session.get()
    // extract relevant data
    const session = json.session.id
    const datacenter = json.session.datacenter
    // determine if we should redirect to the secondary server or primary server
    const host = req.query.dev === 'true' ? 'mm-dev.cxdemo.net' : 'mm.cxdemo.net'
    // redirect client with 302
    return res.redirect(302, `https://${host}?session=${session}&datacenter=${datacenter}`)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e.message)
  }
})

module.exports = router
