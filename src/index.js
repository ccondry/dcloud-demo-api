const app = require('express')()
const cors = require('cors')
const sql = require('./sql')
const bodyParser = require('body-parser')
require('dotenv').load()

app.use(cors())
app.use(bodyParser.json({limit: '5kb'}))

// chat survey answers
app.use('/api/v1/survey', require('./routes/survey'))
// context service
app.use('/api/v1/cs', require('./routes/cs'))

// log 404
app.use((req, res, next) => {
  console.log('404 not found', req.url)
  next()
})

// listen on port defined in .env
const server = app.listen(process.env.NODE_PORT || 3022, () => {
  console.log('Express proxy server listening on port %d in %s mode', server.address().port, app.settings.env)
})
