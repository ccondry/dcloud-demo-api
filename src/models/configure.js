const fs = require('fs')
const xml2js = require('xml2js')
const request = require('request-promise-native')
const util = require('util')

// set default xml to json parsing params
const parser = new xml2js.Parser({explicitArray : false})

// make some promises
const readFile = util.promisify(fs.readFile)
const parseString = util.promisify(parser.parseString)

async function go (body) {
  console.log('running: update dcloud session configuration')
  try {
    // read the dcloud session.xml file
    const xml = await readFile('/dcloud/session.xml')
    // parse session.xml to json object
    const json = await parseString(xml)
    console.log('json', json)

    // REST method
    const method = 'PATCH'
    // url path
    const path = `/api/v1/datacenters/${json.session.datacenter}/sessions/${json.session.id}`

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


module.exports = async function (data) {
  const values = await go(data)
  // evaluate results
  const primarySuccess = !(values[0] instanceof Error)
  const secondarySuccess = !(values[1] instanceof Error)
  // return results
  if (primarySuccess && secondarySuccess) {
    // success
    return 'Successfully updated your dCloud demo configuration on the primary and secondary servers.'
  } else if (primarySuccess) {
    // partial success
    console.error(values[1])
    return 'Successfully updated your dCloud demo configuration on the primary server, but failed to update the secondary server.'
  } else if (secondarySuccess) {
    // partial success
    console.error(values[0])
    return 'Successfully updated your dCloud demo configuration on the secondary server, but failed to update the primary server.'
  } else {
    // failed
    console.error(values[0])
    console.error(values[1])
    throw Error('Failed to update dCloud demo session configuration on the primary and secondary servers.')
  }
}
