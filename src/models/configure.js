const fs = require('fs')
const request = require('request-promise-native')
const session = require('./session')
const cumulus = require('./cumulus')

const mm1 = process.env.MM_API_1 || 'https://mm.cxdemo.net'
// const mm2 = process.env.MM_API_2 || 'https://mm-dev.cxdemo.net'

const defaultConfiguration = {
  vertical: "finance"
}

async function getConfig (userId) {
  let options
  try {
    if (userId) {
      // userId was sent, so just return local database config info
      console.log('getting session configuration for', userId)
      let configuration = await cumulus.getConfig(userId)
      console.log('session configuration for', userId, 'is', configuration)
      console.log('configuration.vertical for', userId, 'is', configuration.vertical)
      // configuration should be at least an empty object
      if (!configuration) {
        configuration = {}
      }
      // set default vertical to 'finance' if it is not set yet
      if (!configuration.vertical) {
        configuration.vertical = 'finance'
      }
      return {configuration}
    } else {
      // userId was undefined/null/empty
      // get session configuration from MM and MM-dev
      console.log('getting session configuration')
      let json = session.get()
      console.log('got session.xml data. session', json.id, 'in datacenter', json.datacenter)
      // url path
      const url = `/api/v1/datacenters/${json.datacenter}/sessions/${json.id}`

      // set timeout to 7 seconds so that secondary can be tried in a
      // reasonable amount of time
      options = {
        baseUrl: mm1,
        url,
        json: true,
        timeout: 5000
      }
      // add userId if it was provided
      if (userId) {
        options.qs = {userId}
      }

      let response
      // get session config from mm
      const r = await request(options)
      // if no configuration set for this session, fill in the default
      if (!r.configuration) {
        r.configuration = defaultConfiguration
        if (r.demo === 'pcce') {
          r.configuration.multichannel = 'ece'
        } else if (r.demo === 'uccx') {
          // r.configuration.multichannel = 'uccx'
        }
      }
      return r
    }
  } catch (e) {
    console.log('failed to get session config from', mm1, e.message)
    // try {
    //   // get session config from mm-dev
    //   options.baseUrl = mm2
    //   // set timeout to 30 seconds
    //   options.timeout = 30000
    //   const r2 = await request(options)
    //   // if no configuration set for this session, fill in the default
    //   if (!r2.configuration) {
    //     r2.configuration = defaultConfiguration
    //     if (r2.demo === 'pcce') {
    //       r2.configuration.multichannel = 'ece'
    //     } else if (r2.demo === 'uccx') {
    //       // r.configuration.multichannel = 'uccx'
    //     }
    //   }
    //   return r2
    // } catch (e2) {
    //   console.log('failed to get session config from', mm2, e2.message)
    //   // failed both
    //   throw e2
    // }
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
      baseUrl: mm1,
      method,
      url,
      headers: {
        Authorization: 'Basic ' + basicAuth
      },
      body,
      json: true,
      timeout: 5000
    }

    // patch session on mm and return results
    return request(options)
  } catch (e) {
    throw e
  }
}

async function updateConfig (data) {
  try {
    // try to update the config
    await patchConfig(data)
    
    // success
    return 'Successfully updated your dCloud demo configuration.'
  } catch (e) {
    // failed
    const message = 'Failed to update dCloud demo session configuration: ' + e.message
    console.error(message)
    throw Error(message)
  } finally {
    // also update in local database to prepare for future move away from mm
    // holding the data
    // save config in local cumulus database with empty string for user ID
    // so that it matches when user Id is not set
    cumulus.saveConfig('', data)
    .then(r => {
      console.log('Successfully saved cumulus config data for scheduled session.')
    })
    .catch(e => {
      console.log('Failed to save cumulus config data for scheduled session:', e.message)
    })
  }
}

module.exports = {
  update: updateConfig,
  get: getConfig
}
