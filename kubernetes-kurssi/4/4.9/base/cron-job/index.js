require('dotenv').config(); 
const { Client } = require('pg');

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});


const wikipediaURL = "https://en.wikipedia.org/wiki/Special:Random";

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

async function addRandomWiki() {
  try {
    const res = await fetch(wikipediaURL);
    const wikipediaTodo = res.url;
    const totalWikipediaTodo = `Read ${wikipediaTodo}` 
    await client.query("INSERT INTO todos (item) VALUES ($1)", [totalWikipediaTodo]);
    client.end();
  } catch (error) {
    console.log("ERROR", error);
    process.exit(0);
  }
}
console.log("RUNNING");
waitForDB();
addRandomWiki();

    