require('dotenv').load()
const model = require('../src/models/upstream')

async function go () {
  console.log('trying to create upstream customer...')
  await model.createCustomer({
    contactId: '2142336226',
    vertical: 'City',
    firstName: 'Coty',
    lastName: 'Condry',
    phone: '2142336226',
    email: 'ccondry@cisco.com'
  })
  console.log('upstream customer created.')

  console.log('setting upstream customer vertical...')
  await model.setVertical({
    contactId: '2142336226',
    vertical: 'Travel'
  })
  console.log('upstream customer vertical set.')
}

go().then(result => {
  console.log('success', result)
}).catch(e => {
  console.error('error', e)
})
