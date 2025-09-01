const express = require('express');
require('dotenv').config(); 

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Todo App is running.\n');
});

app.get("/page", (req, res) => {
  res.send(`
    <html>
      <head><title>Testisivu</title></head>
      <body>
        <h1>Hello World!</h1>
        <p>Tämä on yksinkertainen HTML-vastaus.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
