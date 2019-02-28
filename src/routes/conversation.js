const express = require('express')
const router = express.Router()
const model = require('../models/conversation')
const uuidv1 = require('uuid/v1')

// take conversational IVR speech-to-text transcript and return AI/Bot response
router.get('/', async (req, res) => {
  try {
    console.log('request for conversational IVR transcript AI')
    // validate transcript query string exists, is not an empty string, and is
    // not a string of only "+" characters
    if (
      !req.query ||
      !req.query.transcript ||
      !req.query.transcript.replace(/\+/g, '').length
    ) {
      // return empty result for invalid input
      return res.status(200).send({outputText: ''})
    }
    const rsp = await model({
      q: req.query.transcript,
      sessionId: req.query.sessionId,
      lang: req.query.language,
      token: req.query.token
    })
    return res.status(200).send(rsp)
  } catch (error) {
    console.log('failed to get conversational IVR transcript AI response:', error.message)
    return res.status(500).send(error.message)
  }
})

module.exports = router
