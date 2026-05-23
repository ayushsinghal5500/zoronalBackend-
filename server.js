import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';
import https from 'https';
import http from 'http';

const PORT = process.env.PORT || 5002;

// Self-pinging mechanism to keep Render instance alive
const pingSelf = () => {
  const url = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  console.log(`DEBUG: Sending self-ping to ${url}/health...`);
  
  const protocol = url.startsWith('https') ? https : http;
  
  protocol.get(`${url}/health`, (res) => {
    console.log(`DEBUG: Self-ping status code: ${res.statusCode}`);
  }).on('error', (err) => {
    console.log('DEBUG: Self-ping error:', err.message);
  });
};

// Start pinging every 4 minutes (240000 ms)
setInterval(pingSelf, 240000);

// Database Connection and Server Start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });
