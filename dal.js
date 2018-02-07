require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
PouchDB.plugin(require('pouchdb-find'))
const HTTPError = require('node-http-error')

const db = new PouchDB(process.env.COUCHDB_URL)

const get = function(docId, cb) {
  db.get(docId, function(err, data) {
    if (err) {
      console.log('IM IN THE DAL and theres an error', err)
      return cb(err)
    }
    console.log('hurray! ive got data from the database', data)
    cb(null, data)
  })
}

const dal = {
  get
}

module.exports = dal
