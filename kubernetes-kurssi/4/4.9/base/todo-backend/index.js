const express = require('express');
require('dotenv').config(); 
const cors = require("cors");
const { connect, JSONCodec } = require("nats");
const { Client } = require('pg');
const app = express();
const NATS_URL = process.env.NATS_URL;

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

const publish = async(todo) => {
  const nc = await connect({ servers: NATS_URL });
  const jc = JSONCodec();
  nc.publish("todo_updates", jc.encode({ message: todo}));
  await nc.drain();
};

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
      created_at TIMESTAMP DEFAULT NOW(),
      status TEXT
    );
  `);

  console.log("Database initialized");
}

app.get('/todos', async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM todos ORDER BY id DESC");
    res.send({
      todos: result.rows.map(row => ({
        id: row.id,
        item: row.item,
        created_at: row.created_at,
        status: row.status 
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

app.get('/test', (req, res) => {
  res.send("test");
});

app.put('/todos/:id', async (req, res) => {
  const id = req.params.id;
  const { item } = req.body;
  
  if (!item) return res.status(400).send("Item missing");

  try {
    const result = await client.query(
      "UPDATE todos SET item = $1, status = $2 WHERE id = $3 RETURNING *",
      [item.item, 'done', id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Todo not found");
    }

    const allTodos = await client.query("SELECT * FROM todos ORDER BY id DESC");
    await publish(item.item);
    res.send({
      todos: allTodos.rows.map(row => ({
        id: row.id,
        item: row.item,
        status: row.status,
        created_at: row.created_at
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
});

app.post('/todos', async (req, res) => {
  const { item } = req.body;
  const status = "Not done";
  
  if (!item) return res.status(400).send("Item missing");

  try {
     await client.query(
    "INSERT INTO todos (item, status) VALUES ($1, $2)",
      [item, status || 'pending'] 
    );

    const allTodos = await client.query("SELECT * FROM todos ORDER BY id DESC");
    
    await publish(item);
    res.send(allTodos.rows.map(row => ({
      id: row.id,
      item: row.item,
      status: row.status,
    })));
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