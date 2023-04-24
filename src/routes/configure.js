const express = require('express')
const router = express.Router()
const configure = require('../models/configure')
const verticals = require('../models/verticals')
const upstream = require('../models/upstream')
const demo = require('../models/demo')
const vvb = require('../models/vvb')
const gcpCredential = require('../models/gcp-credential')

// get current demo configuration from mm or mm-dev
router.get('/', async (req, res, next) => {
  let userId
  try {
    // get userId from query params
    userId = req.query.userId
  } catch (e) {
    // continue
  }
  try {
    console.log('request to get demo configuration')
    // get session config
    const config = await configure.get(userId)
    return res.status(200).send(config)
  } catch (e) {
    // failed
    console.error('failed to get dCloud demo session configuration:', e.message)
    return res.status(500).send(e.message)
  }
})

// update demo configuration on mm and mm-dev
router.post('/', async (req, res, next) => {
  try {
    console.log('POST request to configure demo')
    // patch session on mm and mm-dev
    await configure.update(req.body)
    console.log('updated demo configuration data on mm and mm-dev. checking if upstream needs to be configured also...')
  } catch (e) {
    // failed
    const message = `failed to update dCloud demo session configuration: ${e.message}`
    console.error(message)
    return res.status(500).send({message})
  }
  // get demo base config
  let demoBaseConfig
  try {
    demoBaseConfig = await demo.get()
    // console.log('got demo base config:', demoBaseConfig)
  } catch (e) {
    const message = `failed to get demo base config for this demo: ${e.message}`
    console.log(message)
    return res.status(500).send({message})
  }

  let vertical
  // get vertical details from vertical ID
  try {
    vertical = await verticals.getOne(req.body.vertical)
  } catch (e) {
    const message = `failed to get selected demo vertical details: ${e.message}`
    console.log(message)
    return res.status(500).send({message})
  }

  // demo has upstream?
  if (demoBaseConfig.multichannel && demoBaseConfig.multichannel.includes('upstream')) {
    try {
      // set the vertical on the upstream customer using vertical name
      await upstream.setVertical(vertical.name)
      console.log(`set Upstream vertical to ${vertical.name}`)
    } catch (e) {
      const message = `failed to get demo base config for this demo: ${e.message}`
      console.log(message)
      return res.status(500).send({message})
    }
  }

  // demo has CVA, user is logged in, and vertical is owned by a user?
  console(demoBaseConfig.features)
  console(req.headers.authorization)
  console(vertical.owner)
  if (
    demoBaseConfig.features && 
    demoBaseConfig.features.includes('cva') && 
    req.headers.authorization &&
    req.headers.authorization.length > 20 &&
    vertical.owner &&
    vertical.owner !== '' &&
    vertical.owner !== 'system'
  ) {
    // provision ASR, TTS, NLU on PCCE
    let key
    try {
      // get GCP key for this project ID from cumulus-api
      // copy user JWT from headers to authorize the request
      const token = req.headers.authorization.split(' ').pop()
      key = await gcpCredential.get(vertical.gcpProjectId, token)
    } catch (e) {
      const message = `failed to get Google Cloud credentials for vertical ${vertical.id}: ${e.message}`
      console.log(message)
      return res.status(500).send(message)
    }
    // check that we found the key
    if (!key) {
      const message = `did to find Google Cloud credentials for vertical ${vertical.id}`
      console.log(message)
      return res.status(404).send(message)
    }
    // create service account data object
    const serviceAccount = {
      name: vertical.gcpProjectId,
      description: `vertical ${vertical.id}`,
      key
    }

    try {
      // sync asr, tts, nlp service accounts
      await createServiceAccount('asr', serviceAccount)
      await createServiceAccount('tts', serviceAccount)
      await createServiceAccount('nlp', serviceAccount)
    } catch (e) {
      console.log('failed to sync VVB CVA service accounts:', e.message)
    }
  }
  
  // done
  return res.status(200).send()
})

async function createServiceAccount (type, serviceAccount) {
  let existing
  try {
    // look for existing account
    existing = await vvb.cva[type].getServiceAccount(serviceAccount.name)
  } catch (e) {
    // not found?
    if (e.message.startsWith('404')) {
      console.log(type + ' service account not found. creating it...')
      // create
      await vvb.cva[type].createServiceAccount(serviceAccount)
    } else {
      // not 404 error
      console.log(type + ' service account error: ' + e.message)
    }
  }
  // update existing NLP
  if (existing) {
    console.log('found existing ' + type + ' service account. updating it...')
    await vvb.cva[type].updateServiceAccount(serviceAccount)
  }
}

module.exports = router
