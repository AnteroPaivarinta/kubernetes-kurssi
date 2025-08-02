const express = require('express');
require('dotenv').config(); 

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Todo App is running.\n');
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
