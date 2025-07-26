import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { securityMiddleware, generalLimiter, corsOptions, emailLimiter, aiLimiter } from './middleware/security';
import { emailValidationRules, aiValidationRules, handleValidationErrors } from './middleware/validation';
import { handleSendReport } from './handlers/emailHandler';
import { handleGenerateAiSummary } from './handlers/aiHandler';

dotenv.config();

const app = express();

// Apply security middleware
app.use(securityMiddleware);
app.use(generalLimiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.post('/api/send-report', emailLimiter, emailValidationRules, handleValidationErrors, handleSendReport);
app.post('/api/generateAiSummary', aiLimiter, aiValidationRules, handleValidationErrors, handleGenerateAiSummary);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
