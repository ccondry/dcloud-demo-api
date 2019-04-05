const express = require('express')
const router = express.Router()
const model = require('../models/verticals')

// get verticals list from mm or mm-dev
router.get('/', async (req, res, next) => {
  try {
    // make sure the req.query object exists
    req.query = req.query || {}
    console.log('request to get demo verticals. query =', req.query.id)
    if (req.query.id) {
      // get verticals list
      const vertical = await model.getOne(req.query.id)
      // remove any arrays so that CVP doesn't cry when parsing
      for (const key of Object.keys(vertical)) {
        if (Array.isArray(vertical[key])) {
          delete vertical[key]
        }
      }
      return res.status(200).send(vertical)
    } else {
      // get verticals list
      const verticals = await model.get()
      return res.status(200).send(verticals)
    }
  } catch (e) {
    // failed
    console.error('failed to get dCloud demo verticals list:', e.message)
    return res.status(500).send(e.message)
  }
})

// get single vertical from mm or mm-dev
router.get('/:id', async (req, res, next) => {
  try {
    console.log('request to get demo vertical', req.params.id)
    // get vertical config
    const vertical = await model.getOne(req.params.id)
    // remove any arrays so that CVP doesn't cry when parsing
    for (const key of Object.keys(vertical)) {
      if (Array.isArray(vertical[key])) {
        delete vertical[key]
      }
    }
    return res.status(200).send(vertical)
  } catch (e) {
    // failed
    console.error('failed to get dCloud demo vertical', req.params.id, ':', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
