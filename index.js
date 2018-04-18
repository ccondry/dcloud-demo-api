const app = require('express')()
const cors = require('cors')
const sql = require('./sql')
const bodyParser = require('body-parser')
require('dotenv').load()

app.use(cors())
app.use(bodyParser.json({limit: '5kb'}))

app.post('/', (req, res, next) {
  // post the incoming answers to the database
  // const data = {
  //   surveyId: 'SPARKY001',
  //   ani: '1234567890',
  //   name: 'Jim Smith',
  //   q1: '4',
  //   q2: '5',
  // }
  sql.saveAnswers(req.body)
})

// log 404
app.use(function(req, res, next) {
  console.log('404 not found', req.url)
  next()
})

// listen on port defined in .env
const server = app.listen(process.env.NODE_PORT || 3022, () => {
  console.log('Express proxy server listening on port %d in %s mode', server.address().port, app.settings.env)
})
