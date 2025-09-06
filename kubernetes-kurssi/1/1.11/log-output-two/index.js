const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const logFile = path.join('/usr/src/app/files', 'log.txt');
const filePath = path.join("/usr/src/app/files", "count.txt");

app.get('/status', (req, res) => {
    try {
        const data = fs.readFileSync(logFile, 'utf8');
        const pingpongData =  fs.readFileSync(filePath, 'utf8'); 
        res.send(data + ", Ping/Pong: "+pingpongData);
    } catch (err) {
        console.error('Tiedoston lukeminen epäonnistui:', err);
        res.status(500).send('Tiedoston lukeminen epäonnistui');
    }
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
