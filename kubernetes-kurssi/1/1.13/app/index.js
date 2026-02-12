const express = require('express');
const path = require("path");
require('dotenv').config(); 
const FileType = require('file-type'); 

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
          <ul id="todoList"></ul>
        <form id="todoForm">
          <input type="text" id="todoInput" maxlength="140" placeholder="Write a todo" />
          <button type="submit">Add</button>
        </form>

         <script>
          const list = document.getElementById('todoList');
          const form = document.getElementById('todoForm');
          const input = document.getElementById('todoInput');
          const STORAGE_KEY = "todos";

          // hae tallennetut todos
          let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || ["Buy groceries", "Call mom", "Finish project"];

          function renderTodos() {
            list.innerHTML = todos.map(t => "<li>" + t + "</li>").join("");
          }

          form.addEventListener('submit', (e) => {
            e.preventDefault(); // estä lomakkeen lähetys
            const value = input.value.trim();
            if (value && value.length <= 140) {
              todos.push(value);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
              renderTodos();
              input.value = "";
            }
          });
          renderTodos();
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
