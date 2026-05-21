import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import companyRoutes from './routes/comapny.route.js';
import reviewRoutes from './routes/review.route.js';
import { blockApiTools } from './middlewares/security.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  process.env.FRONTEND_URL
].filter(Boolean);

// Middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security: Block API testing tools like Postman
app.use(blockApiTools);

// Static folder for file uploads - adjusting path since app.js is in src/
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Review and Rating API');
});

app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);

export default app;
