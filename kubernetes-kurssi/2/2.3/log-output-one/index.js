const fs = require('fs');
const path = require('path');

function generateRandomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

let storedString = generateRandomString();
const pathName = "/usr/src/app/files";
const logFile = path.join(pathName, 'log.txt');

function logStringWithTimestamp() {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${storedString}\n`;

  console.log(logEntry.trim());

  fs.appendFileSync(logFile, logEntry, 'utf8');
}

setInterval(logStringWithTimestamp, 5000);

logStringWithTimestamp();

