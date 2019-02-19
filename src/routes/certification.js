// update precision queue attribute for an agent
const express = require('express')
const router = express.Router()
const model = require('../models/certification')

router.post('/', async (req, res) => {
  try {
    const agent = req.query.agent
    const grade = req.query.grade
    console.log('request to save precision queue certification data. agent =', agent, 'and grade =', grade)
    const rsp = await model(agent, grade)
    return res.status(202).send(rsp)
  } catch (error) {
    console.log('failed to save precision queue certification data:', error.message)
    return res.status(500).send(error.message)
  }
})

module.exports = router
