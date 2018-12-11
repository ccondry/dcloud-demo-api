const express = require('express')
const router = express.Router()
const model = require('../models/answers')

// get mobile app answers from mm or mm-dev
router.get('/:id', async (req, res, next) => {
  try {
    console.log('request to get mobile app answers for', req.params.id)
    // get answers
    const answers = await model.get(req.params.id)
    return res.status(200).send(answers)
  } catch (e) {
    // failed
    console.error('failed to get mobile app answers for', req.params.id, ':', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
