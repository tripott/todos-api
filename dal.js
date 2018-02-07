require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
PouchDB.plugin(require('pouchdb-find'))
const HTTPError = require('node-http-error')
const sluggo = require('slugify')

const db = new PouchDB(process.env.COUCHDB_URL)

const getDoc = function(docId, cb) {
  db.get(docId, function(err, data) {
    if (err) {
      console.log('IM IN THE DAL and theres an error', err)
      return cb(err)
    }
    console.log('hurray! ive got data from the database', data)
    cb(null, data)
  })
}

const createDoc = function(doc, cb) {
  // TODO slugify the todo name
  doc._id = `todo_${sluggo(doc.name)}`
  doc.type = 'todo'
  db.put(doc, cb)
}

const updateDoc = function(doc, cb) {
  db.put(doc, function(err, updatedResult) {
    if (err) {
      cb(err)
      return
    }
    cb(null, updatedResult)
  })
}

const deleteDoc = function(docId, cb) {
  db.get(docId, function(err, doc) {
    if (err) {
      cb(err)
      return
    }

    console.log('retrieved doc from db.get()', doc)

    db.remove(doc, function(err, deletedResult) {
      if (err) {
        cb(err)
        return
      }
      cb(null, deletedResult)
    })
  })
}

const dal = {
  getDoc,
  createDoc,
  deleteDoc,
  updateDoc
}

module.exports = dal
