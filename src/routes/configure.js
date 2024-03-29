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
  // store private key ID and delete it from the body
  const privateKeyId = req.body.privateKeyId
  delete req.body.privateKeyId

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

  let upstreamError

  // demo has upstream?
  if (demoBaseConfig.multichannel && demoBaseConfig.multichannel.includes('upstream')) {
    try {
      // set the vertical on the upstream customer using vertical name
      await upstream.setVertical(vertical.name)
      console.log(`set Upstream vertical to ${vertical.name}`)
    } catch (e) {
      upstreamError = `failed to set Upstream vertical: ${e.message}`
      // console.log(message)
      // return res.status(500).send({message})
    }
  }

  // demo has CVA, user is logged in, and vertical is owned by a user?
  if (
    // demo has CVA feature
    demoBaseConfig.features &&
    demoBaseConfig.features.includes('cva') &&
    // and selected vertical is user-created
    vertical.owner &&
    vertical.owner !== '' &&
    vertical.owner !== 'system' &&
    // and the GCP project ID is not the default one
    vertical.gcpProjectId &&
    vertical.gcpProjectId !== 'cumulus-v2-hotikl'
  ) {
    console.log('custom branding selected with custom CVA')
    console.log('branding owner = ', vertical.owner)
    console.log('gcpProjectId = ', vertical.gcpProjectId)
    // provision ASR, TTS, NLU on PCCE using GCP credentials
    let key
    try {
      // get GCP key for this project ID from cumulus-api
      key = await gcpCredential.get({
        projectId: vertical.gcpProjectId,
        owner: vertical.owner,
        privateKeyId,
      })
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
      description: `Branding ${vertical.id}`,
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
  } else {
    console.log('system branding selected or it does not include custom CVA')
  }
  
  // done
  return res.status(200).send({
    upstreamError 
  })
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
