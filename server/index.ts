
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailRoutes from './routes/email';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();

// Configure CORS properly
app.use(cors({
  origin: ['http://localhost:5173', 'https://workflow-ai-audit.lovable.app', 'https://audit.nomadicliberty.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api', emailRoutes);
app.use('/api', aiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
