const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
// load .env file into process.env vars
require('dotenv').load()

// make sure we have some default cs-manager servers URLs set, in case they don't exist in .env
process.env.CS_MANAGER_API_1 = process.env.CS_MANAGER_API_1 || 'https://cs-manager.dcloud.cisco.com'
process.env.CS_MANAGER_API_2 = process.env.CS_MANAGER_API_2 || 'https://cs-manager-2.dcloud.cisco.com'

const xmlparser = require('express-xml-bodyparser')
const requestIp = require('request-ip')

// get remote IP address of request client as req.clientIp
app.use(requestIp.mw())

app.use(cors())
app.use(bodyParser.json({limit: '16mb'}))
app.use(bodyParser.urlencoded({limit: '16mb', extended: true }))
app.use(xmlparser())

/*****************
Internal Endpoints
*****************/
// dcloud session info - this route is for internal demo use only, and should
// not have an internet-accessible URL
app.use('/api/v1/session', require('./routes/session'))
// endpoints list for the dcloud-demo-ui website
app.use('/api/v1/endpoints', require('./routes/endpoints'))
// configure demo session
app.use('/api/v1/configure', require('./routes/configure'))
// forward client to cumulus website with session ID and datacenter prefilled
app.use('/api/v1/cumulus', require('./routes/cumulus'))
// forward client to brand website with session ID and datacenter prefilled
app.use('/api/v1/brand', require('./routes/brand'))
// create or modify upstream contact IDs (customers)
app.use('/api/v1/upstream', require('./routes/upstream'))
// create short link
app.use('/api/v1/link', require('./routes/link'))
// send SMS
app.use('/api/v1/sms', require('./routes/sms'))
// send WhatsApp message
app.use('/api/v1/whatsapp', require('./routes/whatsapp'))
// Duo Security 2FA
app.use('/api/v1/duo', require('./routes/duo'))
// PQ Training Certification attribute updater
app.use('/api/v1/certification', require('./routes/certification'))
// Conversational IVR
app.use('/api/v1/conversation', require('./routes/conversation'))
// instant demo customer contact registration
app.use('/api/v1/customer', require('./routes/customer'))
// redirection links
app.use('/api/v1/redirect', require('./routes/redirect'))
// re-run dcloud session automation script
app.use('/api/v1/automation', require('./routes/automation'))
// get demo verticals
app.use('/api/v1/verticals', require('./routes/verticals'))
// get mobile app answers
app.use('/api/v1/answers', require('./routes/answers'))
// get demo base configuration
app.use('/api/v1/demo', require('./routes/demo'))
// request from CVP to send email to internet
app.use('/api/v1/cvp', require('./routes/cvp'))
// request from CVP to look up CCAI name and description from control hub
app.use('/api/v1/ccai', require('./routes/ccai'))
// meta info
app.use('/api/v1/version', require('./routes/version'))

/*****************
External Endpoints
*****************/
// add chat survey answers to db
app.use('/api/v1/survey', require('./routes/survey'))
// context service
app.use('/api/v1/cs', require('./routes/cs'))
// send email service
app.use('/api/v1/email', require('./routes/email'))
// start uccx callback
app.use('/api/v1/callback', require('./routes/callback'))
// get demo status
app.use('/api/v1/status', require('./routes/status'))
// PCCE unified config
// app.use('/api/v1/cce', require('./routes/cce'))

// log 404
app.use((req, res, next) => {
  console.log('404 not found', req.url)
  next()
})

// listen on port defined in .env
const server = app.listen(process.env.NODE_PORT || 3022, () => {
  console.log('Express proxy server listening on port %d in %s mode', server.address().port, app.settings.env)
})
