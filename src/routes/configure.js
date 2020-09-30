const express = require('express')
const router = express.Router()
const configure = require('../models/configure')
const verticals = require('../models/verticals')
const upstream = require('../models/upstream')

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
    const message = await configure.update(req.body)
    console.log('updated demo configuration data on mm and mm-dev. checking if upstream needs to be configured also...')
    // get this session data from mm
    const config = await configure.get()
    // pcce demo?
    if (config.demo === 'pcce' && ['11.6v3', '12.0v1', '12.0v2', '12.5EFT', '12.5v1', '12.5v2'].includes(config.version)) {
      console.log('this is a standard PCCE demo, so set the Upstream vertical also. using vertical', req.body.vertical)
      // get vertical details from vertical ID
      const vertical = await verticals.getOne(req.body.vertical)
      // console.log('vertical =', vertical)
      console.log('Vertical name is', vertical.name)
      // set the vertical on the upstream customer using vertical name
      await upstream.setVertical(vertical.name)
    } else {
      console.log('this demo does not use Upstream, so not configuring vertical on that system')
    }
    return res.status(200).send(message)
  } catch (e) {
    // failed
    console.error('failed to update dCloud demo session configuration:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
