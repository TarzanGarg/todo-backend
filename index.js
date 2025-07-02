const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Welcome to to-do app backend')
})

app.get('/todos', (req, res) => {
    let todos = [{ 'title': 'Get groceries from the market', 'isCompleted': false}, {'title': 'Pay the phone bill', 'isCompleted': true}]
    res.send(todos)
})

app.post('/todos', (req, res) => {
    const body = req.body;
    // call database and save stuff
    res.status(201).send(body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
