const express = require('express')
const router = express.Router()

const util = require('util')
const exec = util.promisify(require('child_process').exec)

// run automation script for this dcloud session
router.get('/', async (req, res, next) => {
  try {
    console.log('request to run dCloud session automation script.')
    exec('/opt/dcloud/automation.sh')
    return res.status(200).send()
  } catch (e) {
    // failed
    console.error('failed to get mobile app answers for', req.params.id, ':', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
