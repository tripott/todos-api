const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => res.send('<h1>Welcome to the ToDos API</h1>'))

app.listen(port, () => console.log('TODOS API IS UP on port', port))
