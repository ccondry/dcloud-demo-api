const express = require('express')
const router = express.Router()

// save survey answers to survey database
router.post('/', async (req, res, next) => {
  // example data
  // const data = {
  //   surveyId: 'SPARKY001',
  //   ani: '1234567890',
  //   name: 'Jim Smith',
  //   q1: '4',
  //   q2: '5',
  // }
  try {
    console.log('request to save survey answers:', req.body)
    // post the incoming answers to the database
    const rows = await sql.saveAnswers(req.body)
    console.log('successfully saved survey answers')
    // accepted
    return res.status(201).send({rows})
  } catch (e) {
    console.error('failed to save survey answers', e)
    return res.status(500).send(e)
  }
})

module.exports = router
