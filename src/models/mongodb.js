const MongoClient = require('mongodb').MongoClient

// load environment file
require('dotenv').load()

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/toolbox'

// connection global
let db

// connect
MongoClient.connect(url, function(connectError, connection) {
  if (connectError || connection === null) {
    console.log('could not connect to mongo db.', connectError)
    return
  }
  console.log('mongo connected to', url)
  // store connection
  db = connection
})

function find (collection, query, options) {
  return new Promise((resolve, reject) => {
    try {
      if (!db) reject('mongo db object was not available')
      db.collection(collection).find(query, options).toArray(function (queryError, result) {
        if (queryError) reject(queryError)
        // console.log(`mongodb retrieved ${result.length} records from ${collection} collection`)
        resolve(result)
      })
    } catch (e) {
      reject(e)
    }
  })
}

function findOne (collection, query, options) {
  return new Promise((resolve, reject) => {
    try {
      if (!db) reject('mongo db object was not available')
      db.collection(collection).findOne(query, options, function (err, result) {
        if (err) reject(err)
        // console.log(`mongodb retrieved record from ${collection} collection`)
        resolve(result)
      })
    } catch (e) {
      reject(e)
    }
  })
}

function upsert (collection, query, data) {
  return new Promise((resolve, reject) => {
    try {
      if (!db) reject('mongo db object was not available')
      db.collection(collection).findOneAndReplace(
        query,
        data,
        { upsert: true },
        function(queryError, doc) {
          if (queryError) {
            console.log('queryError', queryError)
            return reject(queryError)
          } else {
            return resolve(doc)
          }
        }
      )
    } catch (e) {
      return reject(e)
    }
  })
}

function update (collection, query, data, field) {
  return new Promise((resolve, reject) => {
    try {
      if (!db) reject('mongo db object was not available')
      db.collection(collection).update(
        query,
        { $set: { [field]: data } },
        { upsert: true },
        function(queryError, doc) {
          if (queryError) reject(queryError)
          resolve(doc)
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

function addToSet (collection, query, data, field) {
  return new Promise((resolve, reject) => {
    try {
      if (!db) reject('mongo db object was not available')
      db.collection(collection).update(
        query,
        { $addToSet: { [field]: data } },
        { upsert: true },
        function(queryError, doc) {
          if (queryError) reject(queryError)
          resolve(doc)
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

function insert (collection, data) {
  return new Promise((resolve, reject) => {
    try {
      if (!db) reject('mongo db object was not available')
      db.collection(collection).insert(
        data,
        function(queryError, doc) {
          if (queryError) reject(queryError)
          resolve(doc)
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

function remove (collection, query) {
  return new Promise((resolve, reject) => {
    try {
      if (!db) reject('mongo db object was not available')
      db.collection(collection).remove(
        query,
        function(queryError, doc) {
          if (queryError) reject(queryError)
          resolve(doc)
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  find,
  findOne,
  update,
  upsert,
  insert,
  remove,
  addToSet
}
