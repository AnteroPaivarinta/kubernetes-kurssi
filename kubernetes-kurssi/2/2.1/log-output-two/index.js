const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const logFile = path.join('/usr/src/app/files', 'log.txt');

app.get('/', async(req, res) => {

    try {
        const data = fs.readFileSync(logFile, 'utf8');
        const response = await fetch("http://ping-pong-app-svc:2345/pings");
        const pingpongData = await response.json();
        res.send(data + ", Ping/Pong: "+pingpongData);
    } catch (err) {
        console.error('Tiedoston lukeminen epäonnistui:', err);
        res.status(500).send('Tiedoston lukeminen epäonnistui');
    }
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
