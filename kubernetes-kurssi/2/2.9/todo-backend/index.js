const express = require('express');
require('dotenv').config(); 
const cors = require("cors");
const { Client } = require('pg');
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

const wikipediaURL = "https://en.wikipedia.org/wiki/Special:Random";
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});


const PORT = process.env.PORT || 3003;
 
async function waitForDB() {
  while (true) {
    try {
      await client.connect();
      console.log("Database connected");
      break;
    } catch (err) {
      console.log("Waiting for database...!");
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

async function initDB() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      item TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("Database initialized");
}

async function addRandomWiki() {
  try {
    const res = await fetch(wikipediaURL);
    const wikipediaTodo = res.url;
    const totalWikipediaTodo = `Read ${wikipediaTodo}` 
    await client.query("INSERT INTO todos (item) VALUES ($1)", [totalWikipediaTodo]);
  } catch (error) {
    console.log("ERROR", error);
  }
}

    
setInterval(addRandomWiki, 10000);

app.get('/todos', async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM todos ORDER BY id DESC");
    res.send({todos: result.rows.map((value) => value.item)});
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

app.get('/test', (req, res) => {
  res.send("test");
});

app.post('/todos', async (req, res) => {
  const { item } = req.body;
  if (!item) return res.status(400).send("Item missing");

  try {
    await client.query("INSERT INTO todos (item) VALUES ($1)", [item]);

    const allTodos = await client.query("SELECT * FROM todos ORDER BY id DESC");
    res.send(allTodos.rows.map((value) => value.item));
  } catch (err) {
    console.error(err);
    res.status(500).send("Insert failed");
  }
});


(async () => {
  await waitForDB();
  await initDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started in port http://0.0.0.0:${PORT}`);
  });
})();