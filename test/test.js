require('dotenv').load()
// const certification = require('../src/models/certification')
//
// certification('10800325', '10')
// .catch(e => console.error(e.message))

const model = require('../src/models/conversation')

// take conversational IVR speech-to-text transcript and return AI/Bot response
model({
  q: 'bye'
})
.then(r => {
  // return ret
  console.log(r)
})
.catch(e => console.error(e.message))
