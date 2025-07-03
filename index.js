const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const db = require('./database/database').db;

app.get('/', (req, res) => {
  res.send('Welcome to to-do app backend')
})

app.get('/todos', (req, res) => {
    db.all('SELECT * FROM todolist', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving users');
    } else {
      res.json(rows);
    }
  });
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM todolist WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving users');
    }
    if(!row) {
      res.status(404).send('Todo not found');
    }
    else {
      res.json(row);
    }
  });
})

app.post('/todos', (req, res) => {
    const { task, iscompleted} = req.body;
    const date = new Date(Date.now()).toISOString();
    console.log(date)
    db.run('INSERT INTO todolist (task, iscompleted, createddate) VALUES (?, ?, ?)', [task, iscompleted ? 1 : 0, date], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error inserting todo');
    } else {
      res.status(201).json({id : this.lastID, task, iscompleted, createddate:date });
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 