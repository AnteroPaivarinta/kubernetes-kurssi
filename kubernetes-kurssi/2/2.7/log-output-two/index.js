const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const message = process.env.MESSAGE;
const app = express();
const port = process.env.PORT;
const pignsPath = process.env.PINGS_PATH;


const logFile = path.join('/usr/src/app/files', 'log.txt');
const another = path.join('/etc/config', 'information.txt');

app.get('/', async(req, res) => {
    console.log("PATH", pignsPath, "PORT: "+port);
    try {
        const data = fs.readFileSync(logFile, 'utf8');
        const fileContent = fs.readFileSync(another, 'utf8');
        const response = await fetch(pignsPath);
        const pingpongData = await response.json();
        console.log(data + ", Ping/Pong: "+pingpongData + "ENV: "+message, "fileContent: "+fileContent);
        res.send(data + ", Ping/Pong: "+pingpongData);
    } catch (err) {
        console.error('Tiedoston lukeminen epäonnistui:', err);
        res.status(500).send('Tiedoston lukeminen epäonnistui');
    }
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
