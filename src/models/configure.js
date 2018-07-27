const fs = require('fs')
const xml2js = require('xml2js')
const request = require('request-promise-native')
const util = require('util')
// make some promises
const readFile = util.promisify(fs.readFile)
const parseString = util.promisify(xml2js.parseString)

async function go (body) {
  console.log('running: update dcloud session configuration')
  try {
    // read the dcloud session.xml file
    const xml = await readFile('/dcloud/session.xml')
    // parse session.xml to json object
    const json = await parseString(xml)

    // REST method
    const method = 'PATCH'
    // url path
    const path = `/api/v1/datacenters/${json.datacenter}/sessions/${json.id}`

    // patch session on mm
    const p1 = request({
      url: 'https://mm.cxdemo.net' + path,
      method,
      body,
      json: true
    })

    // and patch session on mm-dev
    const p2 = request({
      url: 'https://mm-dev.cxdemo.net' + path,
      method,
      body,
      json: true
    })

    // wait for requests to resolve
    const values = await Promise.all([
      p1.catch(error => { return error }),
      p2.catch(error => { return error })
    ])

    // return results
    return values
  } catch (e) {
    throw e
  }
}

module.exports = go
