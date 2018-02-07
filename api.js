require('dotenv').config()
const express = require('express')
const app = express()
const search = require('./lib/to-do-search')
const reqFieldChecker = require('./lib/check-req-fields')
const objClean = require('./lib/clean-object')
const HTTPError = require('node-http-error')

const {
  append,
  propOr,
  add,
  sort,
  map,
  compose,
  contains,
  head,
  last,
  split,
  prop,
  pathOr,
  filter,
  merge,
  not,
  isEmpty,
  join,
  find,
  path,
  reject
} = require('ramda')

const bodyParser = require('body-parser')
const port = propOr(9999, 'PORT', process.env)

const { getDoc, createDoc, deleteDoc, updateDoc } = require('./dal')

const todos = [
  { id: 1, text: 'Wake up', completed: true },
  { id: 2, text: 'Drink coffee', completed: true },
  { id: 3, text: 'Teach express', completed: true },
  { id: 4, text: 'snore', completed: false }
]

const todoRequiredFieldChecker = reqFieldChecker(['name', 'completed'])
const putToDoRequiredFieldChecker = reqFieldChecker([
  '_id',
  '_rev',
  'name',
  'completed',
  'type'
])

/*
req.params
req.body
req.query
*/
//  CREATE - POST    /todos      COMPLETE
//  READ   - GET     /todos/:id  COMPLETE
//  UPDATE - PUT     /todos/:id  COMPLETE
//  DELETE - DELETE  /todos/:id  COMPLETE
//  LIST   - GET     /todos      COMPLETE

app.use(bodyParser.json())

app.get('/', (req, res) =>
  res.send(`<h1>Welcome to the ToDos API</h1>
  <p>Try these endpoints:</p>
  <ul>
    <li><a href="http://localhost:4000/todos">Retrieves all the todos  GET /todos</a></li>
    <li><a href="http://localhost:4000/todos/1">Retrives a single todo GET /todos/1</a></li>
  </ul>`)
)

app.post('/todos', (req, res, next) => {
  const missingFields = todoRequiredFieldChecker(req.body)

  if (not(isEmpty(missingFields))) {
    next(
      new HTTPError(
        400,
        `Missing Fields: ${join(' ', todoRequiredFieldChecker(req.body))}`
      )
    )
  }

  // talk to the DAL and call createDoc(doc, cb)
  createDoc(req.body, function(err, createdResult) {
    if (err) {
      next(err.status, err.message, err)
      return
    }
    res.status(201).send(createdResult)
    return
  })

  return
})

app.get('/todos/:id', (req, res, next) => {
  getDoc(req.params.id, function(err, data) {
    if (err) {
      next(new HTTPError(err.status, err.message, err))
      return
    }
    res.send(data)
    return
  })
})

app.put('/todos/:id', (req, res, next) => {
  if (isEmpty(prop('body', req))) {
    next(new HTTPError(400, 'Missing request body'))
    return
  }
  // no weird prop are on it.  clean it!
  //{ id: 1, text: 'Wake up', completed: true }
  const bodyCleaner = objClean(['_id', '_rev', 'name', 'completed', 'type'])
  const cleanedBody = bodyCleaner(req.body)
  const missingFields = putToDoRequiredFieldChecker(cleanedBody)

  // all required are props are on it.
  if (not(isEmpty(missingFields))) {
    // call the error handling middleware with an error object.  400, message with missing Fields
    next(
      new HTTPError(
        400,
        `Request body missing these fields: ${join(', ', missingFields)}`
      )
    )
    return
  }

  //
  // create function in the dal named updateDoc(cleanedBody, some cb )
  // import/require from the dal
  // export updateDoc from dal

  updateDoc(cleanedBody, function(err, updatedResult) {
    if (err) {
      next(new HTTPError(err.status, err.message, err))
      return
    }
    res.send(updatedResult)
  })
})

app.delete('/todos/:id', (req, res, next) =>
  //  Get the id of the todo we wish to delete req.params.id
  //  deleteDoc(docId, some anon. callback fn goes here)
  deleteDoc(req.params.id, function(err, deletedResult) {
    if (err) {
      next(new HTTPError(err.status, err.message, err))
      return
    }
    res.send(deletedResult)
  })
)

app.get('/todos', (req, res) => {
  if (pathOr(null, ['query', 's'], req)) {
    const searchProp = compose(head, split(':'), prop('s'))(req.query)
    const searchValue = compose(last, split(':'), prop('s'))(req.query)
    res.send(filter(search(searchProp, searchValue), todos))
  } else {
    res.send(todos)
  }
  return
})

app.use(function(err, req, res, next) {
  console.log('error!', err)
  res.status(err.status || 500) // or use err.statusCode instead
  res.send(err.message)
})

app.listen(port, () => console.log('TODOS API IS UP on port', port))
