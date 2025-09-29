const express = require('express');
const path = require("path");
require('dotenv').config(); 
const FileType = require('file-type');
const fs = require('fs');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
const PORT = process.env.PORT || 3003;

const todos = ["esim1", "esim2"];

app.get('/todos', (req, res) => {
  res.send({todos: todos});
});

app.get('/test', (req, res) => {
  res.send("test");
});

app.post('/todos', (req, res) => {
  const todo = req.body.item;
  todos.push(todo);
  console.log("TODOS", todos)
  res.send(todos);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started in port http://0.0.0.0:${PORT}`);
});
