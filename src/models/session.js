const fs = require('fs')
const xml2js = require('xml2js')
const util = require('util')

// set default xml to json parsing params
const parser = new xml2js.Parser({explicitArray : false})

// make some promises
const readFile = util.promisify(fs.readFile)
const parseString = util.promisify(parser.parseString)

async function getSessionJson () {
  try {
    // read the dcloud session.xml file
    const xml = await readFile(process.env.SESSION_XML_FILE || '/dcloud/session.xml')
    // parse session.xml to json object
    const json = await parseString(xml)
    return json
  } catch (e) {
    throw e
  }
}

module.exports = {
  get: getSessionJson
}
