
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailRoutes from './routes/email';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', emailRoutes);
app.use('/api', aiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
