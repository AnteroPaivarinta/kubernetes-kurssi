

const express = require('express');
const app = express();
const port = 3000;


let a = 0;

app.get('/pingpong', (req, res) => {
  a=a+1;
  res.send(a);
});

app.get('/pings', async(req, res) => {
  res.send(a);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
