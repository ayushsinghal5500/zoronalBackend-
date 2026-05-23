import express from 'express';
import cors from 'cors';
import companyRoutes from './routes/comapny.route.js';
import reviewRoutes from './routes/review.route.js';
import { blockApiTools } from './middlewares/security.middleware.js';

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://zoronal-nine.vercel.app",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD
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

// Security
app.use(blockApiTools);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Review and Rating API');
});

app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);

export default app;