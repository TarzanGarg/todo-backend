const express = require("express");
const sqllite3 = require("sqlite3").verbose();
const app = express();
const dbPath = "mydata.db";

const db = new sqllite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error in connecting data base: ", err.message);
  } else {
    console.log("connection successful");
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todolist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT,
        isCompleted INTEGER NOT NULL CHECK (isCompleted IN (0, 1)),
        createddate TEXT)
    `);
});

exports.db = db;