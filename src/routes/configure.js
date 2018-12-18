const express = require('express')
const router = express.Router()
const configure = require('../models/configure')
const verticals = require('../models/verticals')
const upstream = require('../models/upstream')

// get current demo configuration from mm or mm-dev
router.get('/', async (req, res, next) => {
  try {
    console.log('request to get demo configuration')
    // get session config
    const config = await configure.get()
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
    // get this session data from mm
    const config = await configure.get()
    // pcce demo?
    if (config.demo === 'pcce') {
      // get vertical details from vertical ID
      const vertical = verticals.getOne(req.body.vertical)
      // set the vertical on the upstream customer using vertical name
      await upstream.setVertical(vertical.name)
    }
    return res.status(200).send(message)
  } catch (e) {
    // failed
    console.error('failed to update dCloud demo session configuration:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
