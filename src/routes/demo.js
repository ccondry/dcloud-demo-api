const express = require('express')
const router = express.Router()
const demo = require('../models/demo')

// get demo base configuration
router.get('/', async (req, res, next) => {
  try {
    const config = await demo.get()
    if (config) {
      // found demo config
      return res.status(200).send(config)
    } else {
      // no demos found
      const message = `did not find base configuration for this demo, ${type} ${version} ${instant ? 'instant' : ''}`
      return res.status(404).send({message})
    }
  } catch (e) {
    const message = 'failed to get demo base configuration: ' + e.message
    console.log(message)
    return res.status(500).send({message})
  }
})

module.exports = router
