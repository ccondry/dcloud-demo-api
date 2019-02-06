/**
This loads the session.xml file that is created by the dCloud topology
**/

const fs = require('fs')
const parser = require('xml2json')

let session = {}

const sessionFile = process.env.SESSION_XML_FILE || '/dcloud/session.xml'

function readSessionFile () {
  console.log('reading dCloud session information from file', sessionFile)
  // read the dcloud session file and return the contents of the DIDs section
  fs.readFile(sessionFile, function (err, data) {
    if (err) {
      console.error('failed to read dCloud session information file', sessionFile, err)
      return
    }
    try {
      console.log('parsing dCloud session information file into JSON...')
      // parse xml to json object
      const json = JSON.parse(parser.toJson(data))
      // extract the relevant info
      session = json.session
      console.log('successfully parsed dCloud session information file into JSON')
    } catch (e) {
      console.log('failed to parse dCloud session information file into JSON:', e)
    }
  })
}

// read session file now
readSessionFile()

// re-read the session file every 5 minutes, to make sure we have the latest data
const interval = setInterval(readSessionFile, 1000 * 60 * 5)

module.exports = {
  get () {
    return session
  }
}
