const app = require('express')()
const cors = require('cors')
const sql = require('./sql')
const bodyParser = require('body-parser')
require('dotenv').load()

app.use(cors())
app.use(bodyParser.json({limit: '5kb'}))

app.post('/api/v1/survey', async (req, res, next) => {
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

// log 404
app.use((req, res, next) => {
  console.log('404 not found', req.url)
  next()
})

// listen on port defined in .env
const server = app.listen(process.env.NODE_PORT || 3022, () => {
  console.log('Express proxy server listening on port %d in %s mode', server.address().port, app.settings.env)
})
