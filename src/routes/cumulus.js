const express = require('express')
const router = express.Router()
const fs = require('fs')
const xml2js = require('xml2js')
const util = require('util')
// set default xml to json parsing params
const parser = new xml2js.Parser({explicitArray : false})
// make some promises
const readFile = util.promisify(fs.readFile)
const parseString = util.promisify(parser.parseString)

// forward client to cumulus website
router.get('/', async (req, res, next) => {
  try {
    // read the dcloud session.xml file
    const xml = await readFile('/dcloud/session.xml')
    // parse session.xml to json object
    const json = await parseString(xml)
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
