const express = require('express');
const path = require("path");
require('dotenv').config(); 
const FileType = require('file-type'); // <-- lisää tämä

const fs = require('fs');

const app = express();
app.use(express.static("public"));
const PORT = process.env.PORT || 3000;
const URL = "https://picsum.photos/1200";


async function savePhotoFromAPI () {
    console.log("HELLO?")
    const response = await fetch(URL);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = await FileType.fromBuffer(buffer);
    if (fileType.ext) {
      const outputFileName = path.join(__dirname, "public", `image.${fileType.ext}`);
      const outputFileNameOld = path.join(__dirname, "public", `image_old.${fileType.ext}`);
      fs.createWriteStream(outputFileName).write(buffer);
      if (!fs.existsSync(outputFileNameOld)) {
        fs.createWriteStream(outputFileNameOld).write(buffer);
      } 
    } else {
      console.log('File type could not be reliably determined! The binary data may be malformed! No file saved!')
    }
};
savePhotoFromAPI();
setInterval(savePhotoFromAPI, 10000)

app.get('/', (req, res) => {
  res.send('Todo App is running.\n');
});

app.get("/page", async (req, res) => {
  let dataURL = "";
  if (fs.existsSync("public/image_old.jpg")) {
    const kuvaBuffer = fs.readFileSync("public/image_old.jpg");
    const kuvaBase64 = kuvaBuffer.toString("base64");
    dataURL = `data:image/png;base64,${kuvaBase64}`;
    fs.rm('public/image_old.jpg', { force: true }, (err) => {
      if (err) console.error(err);
    });

  } else {
    dataURL = "image.jpg"
  }
 

  res.send(`
    <html>
      <head><title>Testisivu</title></head>
      <body>
        <h1>Hello World!</h1>
        <p>Tämä on yksinkertainen HTML-vastaus.</p>
        <img src="${dataURL}" alt="Satunnainen kuva">
         <h1>Hei?</h1>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
