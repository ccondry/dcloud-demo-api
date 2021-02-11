const express = require('express')
const router = express.Router()
const tokens = require('../models/tokens')
const cce = require('../models/cce')
const ccai = require('../models/ccai')

// get cloud connect details for a given call type ID
async function getCcaiInfo (req, res) {
  try {
    // get ID from URL parameter or URL query parameter
    const id = req.params.id || req.query.id
    // get call type info from ID, from PCCE
    const callType = cce.get('calltype', id)
    // get access token from cloud connect
    const token = tokens.cloudConnect.get()
    // get CCAI info from control hub
    const ret = ccai.getConfig({
      id: callType.ccaiConfigID,
      token
    })
    return res.status(202).send(ret)
  } catch (error) {
    console.log('failed to save precision queue certification data:', error.message)
    return res.status(500).send({message: error.message})
  }
}

router.get('/:id', getCcaiInfo)
router.get('/', getCcaiInfo)

module.exports = router
