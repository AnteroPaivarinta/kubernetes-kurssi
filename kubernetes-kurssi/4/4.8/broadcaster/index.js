// broadcaster.js
const { connect, JSONCodec } = require("nats");
const axios = require("axios");

const NATS_URL = process.env.NATS_URL || "localhost:4222";
const DISCORD_URL = process.env.DISCORD_TOKEN;

async function start() {
  const nc = await connect({ servers: NATS_URL });
  const jc = JSONCodec();
  
  // TÄRKEÄÄ: Tämä queue varmistaa, ettei 6 replikaa lähetä duplikaatteja
  const sub = nc.subscribe("todo_updates", { queue: "broadcaster-group" });

  console.log("Broadcaster erillinen palvelu käynnissä...");

  for await (const m of sub) {
    const data = jc.decode(m.data);
    
    // Lähetys Discordiin
    if (DISCORD_URL) {
      await axios.post(DISCORD_URL, {
        content: `Uusi todo tapahtuma: ${data.message}`
      });
    }
    console.log(`Viesti välitetty eteenpäin: ${data.message}`);
  }
}

start();