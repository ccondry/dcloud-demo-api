const express = require('express')
const router = express.Router()
const configure = require('../models/configure')

router.get('/', async (req, res, next) => {
  try {
    console.log('request to configure demo')
    // patch session on mm and mm-dev
    const values = await configure(req.query)
    // log results
    const primarySuccess = values[0] instanceof Error
    const secondarySuccess = values[1] instanceof Error
     // ? 'failed' : 'success'
    console.log('Update dCloud session configuration on primary server:', primary)
    console.log('Update dCloud session configuration on secondary server:', secondary)
    if (primarySuccess && secondarySuccess) {
      // success
      return res.status(200).send('Successfully updated your dCloud demo configuration on the primary and secondary servers.')
    } else if (primarySuccess) {
      // partial success
      return res.status(200).send('Successfully updated your dCloud demo configuration on the primary server, but failed to update the secondary server.')
    } else if (secondarySuccess) {
      // partial success
      return res.status(200).send('Successfully updated your dCloud demo configuration on the secondary server, but failed to update the primary server.')
    } else {
      // failed
      const message = 'Failed to update dCloud demo session configuration.'
      console.error(message)
      return res.status(500).send(message)
    }
  } catch (e) {
    // failed
    console.error('failed to update dCloud demo session configuration:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
