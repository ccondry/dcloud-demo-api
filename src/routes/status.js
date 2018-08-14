const express = require('express')
const router = express.Router()
const model = require('../models/status')

// get finesse context service machine account status
router.get('/finesse/cs', async (req, res, next) => {
  try {
    const status = await model.finesse.getCsStatus()
    console.log('Successfully got Finesse Context Service status and machine account info. Returning to client.')
    return res.status(200).send(status)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e.message)
  }
})

// get CCE Web Admin context service machine account status
router.get('/cce/cs', async (req, res, next) => {
  try {
    const status = await model.cce.getCsStatus()
    console.log('Successfully got CCE Context Service status and machine account info. Returning to client.')
    return res.status(200).send(status)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e.message)
  }
})

module.exports = router
