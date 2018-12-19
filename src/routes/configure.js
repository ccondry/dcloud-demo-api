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

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

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
    if (config.demo === 'pcce') {
      console.log('this is pcce demo, so set the upstream vertical also')
      let verticalName = 'Finance'
      try {
        const verticalId = req.body.vertical
        verticalName = capitalizeFirstLetter(verticalId)
        console.log('Upstream vertical is', verticalName)
      } catch (e) {
        console.log('I think the vertical was not configured on this demo session. Using default of "Finance" for Upstream vertical.', e.message)
      }
      console.log('setting the Upstream vertical to', verticalName)
      // set the vertical on the upstream customer using vertical name
      await upstream.setVertical(verticalName)
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
