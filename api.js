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

console.log('process.env.PORT', process.env.PORT)

const todos = [
  { id: 1, text: 'Wake up', completed: true },
  { id: 2, text: 'Drink coffee', completed: true },
  { id: 3, text: 'Teach express', completed: true },
  { id: 4, text: 'snore', completed: false }
]

const todoRequiredFieldChecker = reqFieldChecker(['text'])
const putToDoRequiredFieldChecker = reqFieldChecker(['id', 'text', 'completed'])

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
  const sorter = (a, b) => a - b
  const newID = compose(add(1), last, sort(sorter), map(todo => todo.id))(todos)

  const missingFields = todoRequiredFieldChecker(req.body)

  if (not(isEmpty(missingFields))) {
    next(
      new HTTPError(
        400,
        `Missing Fields: ${join(' ', todoRequiredFieldChecker(req.body))}`
      )
    )
  }

  todos.push(merge(req.body, { id: newID }))
  res.status(201).send(merge(req.body, { id: newID }))
  return
})

app.get('/todos/:id', (req, res, next) => {
  const foundToDo = find(todo => todo.id == req.params.id, todos)

  if (foundToDo) {
    res.send(foundToDo)
  } else {
    next(new HTTPError(404, 'Todo Not Found'))
  }
  return
})

app.put('/todos/:id', (req, res, next) => {
  if (isEmpty(prop('body', req))) {
    next(new HTTPError(400, 'Missing request body'))
    return
  }
  // no weird prop are on it.  clean it!
  //{ id: 1, text: 'Wake up', completed: true }
  const bodyCleaner = objClean(['id', 'text', 'completed'])

  const cleanedBody = bodyCleaner(req.body)
  console.log('cleanedBody', cleanedBody)
  const missingFields = putToDoRequiredFieldChecker(cleanedBody)
  console.log('missingFields', missingFields)
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

  // Option 1
  // remove the item the Array
  // append the item back into the array
  res.send(
    compose(append(cleanedBody), reject(todo => todo.id == req.params.id))(
      todos
    )
  )
})

app.delete('/todos/:id', (req, res, next) =>
  res.send(reject(todo => todo.id == req.params.id, todos))
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
  res.status(err.status || 500) // or use err.statusCode instead
  res.send(err.message)
})

app.listen(port, () => console.log('TODOS API IS UP on port', port))
