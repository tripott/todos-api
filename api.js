require('dotenv').config()
const express = require('express')
const app = express()
const { propOr } = require('ramda')

//const port = process.env.PORT || 4000
const port = propOr(9999, 'PORT', process.env)

console.log('process.env.PORT', process.env.PORT)

const todos = [
  { id: 1, text: 'Wake up', completed: true },
  { id: 2, text: 'Drink coffee', completed: true },
  { id: 3, text: 'Teach express', completed: false }
]

app.get('/', (req, res) => res.send('<h1>Welcome to the ToDos API</h1>'))
app.get('/todos', (req, res) => res.send(todos))

app.listen(port, () => console.log('TODOS API IS UP on port', port))
