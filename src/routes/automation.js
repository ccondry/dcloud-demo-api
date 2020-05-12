const express = require('express')
const router = express.Router()

const model = require('../models/automation')

// run automation script for this dcloud session
router.get('/', async (req, res, next) => {
  try {
    console.log('request to run dCloud session automation script.')
    // await exec('cd /opt/dcloud-demo-automation;node src/index')
    // return res.status(200).send('Done! Your dCloud session information should now be available.')
    return res.status(200).send(model.env)
  } catch (e) {
    // failed
    console.error('failed to run dCloud session autmation script:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
