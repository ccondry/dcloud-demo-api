const fs = require('fs')
const request = require('request-promise-native')
const session = require('./session')
const cumulus = require('./cumulus')

async function getConfig (username) {
  const instantDemo = process.env.INSTANT_DEMO === 'true'
  if (instantDemo && username) {
    console.log('getting session configuration for', username)
    // get session info from xml file
    const json = session.get()
    // get configuration data from local database and add to session info
    json.configuration = cumulus.getConfig(username)
    // return combined data
    return json
  } else {
    console.log('getting session configuration')
    let json = session.get()
    console.log('got session.xml data. session', json.id, 'in datacenter', json.datacenter)
    // url path
    const url = `/api/v1/datacenters/${json.datacenter}/sessions/${json.id}`

    const options = {
      baseUrl: process.env.MM_API_1,
      url,
      json: true
    }
    let response
    try {
      // get session config from mm
      const r = await request(options)
      // if no configuration set for this session, fill in the default
      if (!r.configuration) {
        r.configuration = cumulus.getConfig()
        if (r.demo === 'pcce') {
          r.configuration.multichannel = 'ece'
        } else if (r.demo === 'uccx') {
          // r.configuration.multichannel = 'uccx'
        }
      }
      return r
    } catch (e) {
      console.log('failed to get session config from', process.env.MM_API_1, e.message)
      try {
        // get session config from mm-dev
        options.baseUrl = process.env.MM_API_2
        const r2 = await request(options)
        // if no configuration set for this session, fill in the default
        if (!r2.configuration) {
          r.configuration = cumulus.getConfig()
          if (r.demo === 'pcce') {
            r.configuration.multichannel = 'ece'
          } else if (r.demo === 'uccx') {
            // r.configuration.multichannel = 'uccx'
          }
        }
        return r2
      } catch (e2) {
        console.log('failed to get session config from', process.env.MM_API_2, e2.message)
        // failed both
        throw e2
      }
    }
  }
}

async function patchConfig (body) {
  console.log('running: update dcloud session configuration')
  try {
    const json = await session.get()
    // REST method
    const method = 'PATCH'
    // url path
    const url = `/api/v1/datacenters/${json.datacenter}/sessions/${json.id}`
    // basic auth is the anyconnect username and password for this dcloud session
    const username = `v${json.vpod}user1`
    const basicAuth = Buffer.from(`${username}:${json.anycpwd}`).toString('base64')
    const options = {
      baseUrl: process.env.MM_API_1,
      method,
      url,
      headers: {
        Authorization: 'Basic ' + basicAuth
      },
      body,
      json: true
    }

    // patch session on mm
    const p1 = request(options)

    // and patch session on mm-dev
    options.baseUrl = process.env.MM_API_2
    const p2 = request(options)

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

async function updateConfig (data) {
  try {
    // try to update the config
    const values = await patchConfig(data)
    // evaluate results
    const primarySuccess = !(values[0] instanceof Error)
    const secondarySuccess = !(values[1] instanceof Error)
    // return results
    if (primarySuccess && secondarySuccess) {
      // success
      let message = 'Successfully updated your dCloud demo configuration on the primary and secondary servers. \r\n'
      message += 'Settings: ' + JSON.stringify(data)
      return message
    } else if (primarySuccess) {
      // partial success
      console.error(values[1].message)
      let message = 'Successfully updated your dCloud demo configuration on the primary server, but failed to update the secondary server. \r\n'
      message += 'Settings: ' + JSON.stringify(data)
      return message
    } else if (secondarySuccess) {
      // partial success
      console.error(values[0].message)
      let message = 'Successfully updated your dCloud demo configuration on the secondary server, but failed to update the primary server. \r\n'
      message += 'Settings: ' + JSON.stringify(data)
      return message
    } else {
      // failed
      console.error(values[0].message)
      console.error(values[1].message)
      let message = 'Failed to update dCloud demo session configuration on the primary and secondary servers. \r\n'
      message += 'Settings: ' + JSON.stringify(data)
      throw Error(message)
    }
  } catch (e) {
    throw e
  }
}

module.exports = {
  update: updateConfig,
  get: getConfig
}
