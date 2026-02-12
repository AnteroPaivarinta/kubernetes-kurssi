const fs = require('fs');
const path = require('path');

// Generate a random alphanumeric string
function generateRandomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Store the string in memory
let storedString = generateRandomString();
const pathName = "/usr/src/app/files";
// File path for logging
const logFile = path.join(pathName, 'log.txt');

// Function to log with timestamp (console + file)
function logStringWithTimestamp() {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${storedString}\n`;

  console.log(logEntry.trim());

  fs.appendFileSync(logFile, logEntry, 'utf8');
}

// Output every 5 seconds
setInterval(logStringWithTimestamp, 5000);

// Optionally log immediately on start
logStringWithTimestamp();


