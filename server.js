import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';

const PORT = process.env.PORT || 5002;

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
