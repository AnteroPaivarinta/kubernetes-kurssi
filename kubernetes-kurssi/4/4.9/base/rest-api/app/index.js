const express = require('express');
const path = require("path");
require('dotenv').config(); 
const FileType = require('file-type');
const fs = require('fs');
const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(cors());
const PORT = process.env.PORT || 3001;
const URL = "https://picsum.photos/1200";


async function savePhotoFromAPI () {
   
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


app.get("/page", async (req, res) => {
  let dataURL = "";
  let kuvaBuffer = "";
  let kuvaBase64 = "";
  if (fs.existsSync("public/image_old.jpg")) {
    kuvaBuffer = fs.readFileSync("public/image_old.jpg");
    kuvaBase64 = kuvaBuffer.toString("base64");
    dataURL = `data:image/png;base64,${kuvaBase64}`;
    fs.rm('public/image_old.jpg', { force: true }, (err) => {
      if (err) console.error(err);
    });
  } else {
    kuvaBuffer = fs.readFileSync("public/image.jpg");
    kuvaBase64 = kuvaBuffer.toString("base64");
    dataURL = `data:image/png;base64,${kuvaBase64}`;
  }
  res.send({url: dataURL});
});


app.get("/testi23", async (req, res) => {
  
  res.send("testi27");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started in port ${PORT}`);
});
