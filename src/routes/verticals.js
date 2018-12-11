const express = require('express')
const router = express.Router()
const model = require('../models/verticals')

// get verticals list from mm or mm-dev
router.get('/', async (req, res, next) => {
  try {
    console.log('request to get demo verticals list')
    // get verticals list
    const verticals = await model.get()
    return res.status(200).send(verticals)
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
    return res.status(200).send(vertical)
  } catch (e) {
    // failed
    console.error('failed to get dCloud demo vertical', req.params.id, ':', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
