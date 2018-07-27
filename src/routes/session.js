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

router.get('/', async (req, res, next) => {
  console.log('request to get session data')
  try {
    // read the dcloud session.xml file
    const xml = await readFile('/dcloud/session.xml')
    // parse session.xml to json object
    const json = await parseString(xml)
    // return data
    return res.status(200).send(json.session)
  } catch (e) {
    console.error('failed to get session data', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
