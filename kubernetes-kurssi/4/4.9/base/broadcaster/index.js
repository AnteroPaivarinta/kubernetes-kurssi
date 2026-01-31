// broadcaster.js
const { connect, JSONCodec } = require("nats");
const axios = require("axios");

const NATS_URL = process.env.NATS_URL || "localhost:4222";
const DISCORD_URL = process.env.DISCORD_TOKEN;
const STATE = process.env.STATE || "unknown";
//const STAGING = "STAGING";
const PRODUCTION = "PRODUCTION";

async function start() {
  const nc = await connect({ servers: NATS_URL });
  const jc = JSONCodec();
  
  const sub = nc.subscribe("todo_updates", { queue: "broadcaster-group" });

  console.log("Broadcaster erillinen palvelu käynnissä...");

  for await (const m of sub) {
    const data = jc.decode(m.data);
    console.log(`Viesti välitetty eteenpäin: ${data.message}`);
    if (DISCORD_URL && STATE == PRODUCTION) {
      await axios.post(DISCORD_URL, {
        content: `Uusi todo tapahtuma: ${data.message}`
      });
    }
  }
}

start();