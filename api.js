const express = require('express')
const app = express()
const port = 4000

console.log('process.env', process.env)

const todos = [
  { id: 1, text: 'Wake up', completed: true },
  { id: 2, text: 'Drink coffee', completed: true },
  { id: 3, text: 'Teach express', completed: false }
]

app.get('/', (req, res) => res.send('<h1>Welcome to the ToDos API</h1>'))
app.get('/todos', (req, res) => res.send(todos))

app.listen(port, () => console.log('TODOS API IS UP on port', port))
