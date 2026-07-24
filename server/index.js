import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reviewRouter from './routes/review.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/api', reviewRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'RefactorPulse AI Server',
    timestamp: new Date().toISOString(),
    groqKeyConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '' && process.env.GROQ_API_KEY !== 'your_groq_api_key_here')
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.url} does not exist.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message || 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`⚡ RefactorPulse AI Server listening on http://localhost:${PORT}`);
});
