require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
PouchDB.plugin(require('pouchdb-find'))
const HTTPError = require('node-http-error')

const db = new PouchDB(process.env.COUCHDB_URL)

db.get('todo_feed-cat', function(err, doc) {
  if (err) {
    console.log('error', err)
    return
  }
})

console.log('You never know when I will show up')
