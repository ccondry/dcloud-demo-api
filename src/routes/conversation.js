const express = require('express')
const router = express.Router()
const model = require('../models/conversation')
const uuid = require('uuid')

// take conversational IVR speech-to-text transcript and return AI/Bot response
router.get('/', async (req, res) => {
  try {
    console.log('request for conversational IVR transcript AI')
    // validate transcript query string exists, is not an empty string, and is
    // not a string of only "+" characters
    if (
      !req.query ||
      !req.query.transcript ||
      !req.query.transcript.replace(/\+/g, '').trim().length
    ) {
      // return empty result for invalid input
      return res.status(200).send({outputText: ''})
    }
    console.log('doing conversational IVR request for query = `' + req.query.transcript + '`')
    const rsp = await model({
      text: req.query.transcript,
      sessionId: req.query.sessionId || uuid.v4(),
      languageCode: req.query.languageCode,
      projectId: req.query.projectId
    })
    console.log('DialogFlow response:', rsp)
    console.log('stripping any extra sessionId in DialogFlow response...')
    let sessionId = rsp.sessionId
    try {
      sessionId = rsp.sessionId.split('/').pop()
      console.log('sessionId is now', sessionId)
    } catch (e) {
      console.log('failed to split and pop sessionId:', e.message)
    }
    const body = {
      outputText: rsp.outputText.replace(/[\'\"\!\,\?]/g, ''),
      action: rsp.action,
      projectId: rsp.projectId,
      languageCode: rsp.languageCode,
      sessionId
    }
    console.log('conversational IVR - returning', body)
    // send only relevant data, and don't send any arrays?
    return res.status(200).send(body)
  } catch (error) {
    console.log('failed to get conversational IVR transcript AI response:', error.message)
    console.log('conversational IVR token in req.query.token was:', req.query.token)
    return res.status(500).send(error.message)
  }
})

module.exports = router
