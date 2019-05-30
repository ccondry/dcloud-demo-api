const mssql = require('mssql')

async function saveAnswers (data) {
  // truncate data to SQL column max lengths, to prevent insertion errors
  data.surveyId ? data.surveyId = data.surveyId.slice(0, 10) : ;
  data.ani ? data.ani = data.ani.slice(0, 32) : ;
  data.name ? data.name = data.name.slice(0, 50) : ;
  data.q1 ? data.q1 = data.q1.slice(0, 10) : ;
  data.q2 ? data.q2 = data.q2.slice(0, 10) : ;
  // q3 is actually agent ID, so truncate to last 10 digits (keep significant
  // digits for instant demo agent IDs)
  data.q3 ? data.q3 = data.q3.slice(-10) : ;

  const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_HOST,
    database: process.env.SQL_DB
  }

  const query = `INSERT INTO [PostCallSurvey] (DateTime, SurveyId, ANI, Name, Q1, Q2, Q3)
  VALUES (@datetime, @surveyId, @ani, @name, @q1, @q2, @q3)`

  try {
    const pool = await new mssql.ConnectionPool(config).connect()
    const results = await pool.request()
    .input('datetime', mssql.DateTime, new Date())
    .input('surveyId', mssql.VarChar, data.surveyId)
    .input('ani', mssql.VarChar, data.ani)
    .input('name', mssql.VarChar, data.name)
    .input('q1', mssql.VarChar, data.q1)
    .input('q2', mssql.VarChar, data.q2)
    .input('q3', mssql.VarChar, data.q3)
    .query(query)
    mssql.close()
    return results.rowsAffected
  } catch (e) {
    mssql.close()
    throw e
  }

  mssql.close()
  return results
}

module.exports = { saveAnswers }
