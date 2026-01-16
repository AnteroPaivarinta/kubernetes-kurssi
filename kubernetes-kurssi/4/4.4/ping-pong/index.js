

const express = require('express');
const app = express();
const port = 3000;
const { Client } = require('pg');

const client = new Client({
  host: 'postgres-svc',
  port: 5432,
  user: 'postgres',
  password: 'example',
  database: 'postgres'
});

async function setupDatabase() {
  await client.connect();
  console.log("Connected to Postgres!");
  await client.query(`
    CREATE TABLE IF NOT EXISTS pingpong_counter (
      id SERIAL PRIMARY KEY,
      counter INT NOT NULL
    )
  `);

  const res = await client.query('SELECT COUNT(*) FROM pingpong_counter');
  if (parseInt(res.rows[0].count) === 0) {
    await client.query('INSERT INTO pingpong_counter(counter) VALUES($1)', [0]);
    console.log("Initialized counter to 0");
  }
};

setupDatabase();

app.get('/healthz', async (req, res) => {
  try {
    await client.query('SELECT 1');
    res.status(200).send('ok');
  } catch (err) {
    res.status(500).send('db not reachable');
  }
});

app.get('/pingpong', async(req, res) => {
  try {
    await client.query('UPDATE pingpong_counter SET counter = counter + 1 WHERE id = 1');
    const result = await client.query('SELECT counter FROM pingpong_counter WHERE id = 1');
    res.send(result.rows[0].counter.toString());
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating counter');
  }
});


app.get('/pings', async(req, res) => {
  try {
    const result = await client.query('SELECT counter FROM pingpong_counter WHERE id = 1');
    res.send(result.rows[0].counter.toString());
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading counter');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
