require('dotenv').load()
const model = require('../src/models/upstream')

async function go () {
  /* create customer */
  // console.log('trying to create upstream customer...')
  // await model.createCustomer({
  //   contactId: '2142336226',
  //   vertical: 'City',
  //   firstName: 'Coty',
  //   lastName: 'Condry',
  //   phone: '2142336226',
  //   email: 'ccondry@cisco.com'
  // })
  // console.log('upstream customer created.')

  /* set customer vertical */
  // console.log('setting upstream customer vertical...')
  // await model.setVertical({
  //   contactId: '2142336226',
  //   vertical: 'Travel'
  // })
  // console.log('upstream customer vertical set.')

  /* get customers */
  console.log('getting upstream customers...')
  const customers = await model.getCustomers()
  console.log('upstream customers:', customers.length)
}

go().then(result => {
  // console.log('success', result)
  return
}).catch(e => {
  console.error('error', e)
})
