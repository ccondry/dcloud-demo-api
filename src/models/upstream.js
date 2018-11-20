const mssql = require('mssql')

const config = {
  user: process.env.UPSTREAM_SQL_USER,
  password: process.env.UPSTREAM_SQL_PASSWORD,
  server: process.env.UPSTREAM_SQL_HOST,
  database: process.env.UPSTREAM_SQL_DB
}

async function createCustomer (data) {
  try {
    // get connection pool
    const pool = await new mssql.ConnectionPool(config).connect()
    const request1 = new mssql.Request(pool)
    .input('ContactId', data.contactId)
    .input('FirstName', data.firstName)
    .input('LastName', data.lastName)
    .input('PhoneNumber', data.phone)
    .input('EmailAddress', data.email)
    .input('Vertical', data.vertical)
    // .output('return_value', mssql.Int)
    // run sp
    const results1 = await request1.execute('dCloudSetCustomer')
    // const ret = results1.output.return_value
    console.log('results1', results1)

    // mssql.close()
    // return results.rowsAffected
    return results1
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

async function setVertical (data) {

  try {
    // get connection pool
    const pool = await new mssql.ConnectionPool(config).connect()
    const request1 = new mssql.Request(pool)
    .input('ContactId', data.contactId)
    .input('Vertical', data.vertical)
    // run sp
    const results1 = await request1.execute('dCloudSetCustomerVertical')
    // const ret = results1.output.return_value
    // console.log('ret', ret)


    // const pool = await new mssql.ConnectionPool(config).connect()
    // const results = await pool.request()
    // .input('datetime', mssql.DateTime, new Date())
    // .input('surveyId', mssql.VarChar, data.surveyId)
    // .input('ani', mssql.VarChar, data.ani)
    // .input('name', mssql.VarChar, data.name)
    // .input('q1', mssql.VarChar, data.q1)
    // .input('q2', mssql.VarChar, data.q2)
    // .query(query)
    // return results.rowsAffected
    return results1
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

module.exports = { setVertical, createCustomer }
