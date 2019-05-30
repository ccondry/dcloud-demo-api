const express = require('express')
const router = express.Router()
const model = require('../models/survey')

// save survey answers to survey database
router.post('/', doSaveAnswers)
router.get('/', doSaveAnswers)

async function doSaveAnswers (req, res, next) {
  // example data
  // const data = {
  //   surveyId: 'SPARKY001',
  //   ani: '1234567890',
  //   name: 'Jim Smith',
  //   q1: '4',
  //   q2: '5',
  //   q3: 'rbarrows0325'
  // }
  try {
    let answers
    if (Object.keys(req.body).length) {
      answers = req.body
    } else {
      answers = req.query
    }
    console.log('request to save survey answers:', answers)

    // validate
    if (!answers.surveyId || !answers.q1 || !answers.q2 || !answers.ani) {
      // invalid data
      // return 400 bad input
      return res.status(400).send('Please provide name, ani, surveyId, q1, q2 in the body or query parameters.')
    }
    // post the incoming answers to the database
    const rows = await model.saveAnswers(answers)
    console.log('successfully saved survey answers')
    // accepted
    return res.status(201).send({rows})
  } catch (e) {
    console.error('failed to save survey answers', e)
    return res.status(500).send(e)
  }
}

module.exports = router
