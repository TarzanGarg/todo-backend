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



app.patch('/todos/:id', (req, res) =>{
  const id = req.params.id;
  let query = 'UPDATE todolist SET ';
  let params = []
  if (!!req.body.task) {
    query += 'task = ? ';
    params.push(req.body.task);
  }

  if (req.body?.isCompleted === true || req.body?.isCompleted === false) {
    if (params.length > 0) {
      query += ',';
    }

    query += 'iscompleted = ? ';
    params.push(req.body.isCompleted);
  }

  if (params.length > 0) {
    query += 'WHERE id = ?'
    params.push(id);
    console.log(query);
    db.run(query, params, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating todo');
      }
      else {
        res.sendStatus(200);
      }
    });
  }
  else {
    res.sendStatus(204);
  }
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

app.delete('/todos/:id',(req,res) => {
  const query = 'DELETE FROM todolist WHERE id=?';
  const id = req.params.id;
  db.run( query, [id], (err) => {
    if(err){
      res.sendStatus(500);
    }
    else {
      res.sendStatus(204)
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 