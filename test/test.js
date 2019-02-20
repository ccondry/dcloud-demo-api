require('dotenv').load()
const certification = require('../src/models/certification')

certification('10800325', '10')
.catch(e => console.error(e.message))
