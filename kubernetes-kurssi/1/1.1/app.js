// app.js

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
const storedString = generateRandomString();

// Function to log with timestamp
function logStringWithTimestamp() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${storedString}`);
}

// Output every 5 seconds
setInterval(logStringWithTimestamp, 5000);

// Optionally log immediately on start
logStringWithTimestamp();
