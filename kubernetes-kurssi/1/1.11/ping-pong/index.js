

const fs = require("fs");
const express = require('express');
const path = require("path");
const app = express();
const port = 3000;




app.get('/pingpong', (req, res) => {
  const filePath = path.join("/usr/src/app/files", "count.txt");

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "0");
  }

  let count = parseInt(fs.readFileSync(filePath, "utf8"), 10);
  count += 1;
  fs.writeFileSync(filePath, count.toString());
  res.send("Ping/PONGS: " + count);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
