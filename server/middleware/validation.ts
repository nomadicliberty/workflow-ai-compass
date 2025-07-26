import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';

export const validateEmailRequest = [
  body('userEmail').isEmail().normalizeEmail(),
  body('userName').optional().isLength({ min: 1, max: 100 }).trim().escape(),
  body('painPoint').optional().isLength({ max: 500 }).trim().escape(),
  body('techReadiness').optional().isLength({ max: 500 }).trim().escape(),
  body('report').notEmpty().withMessage('Report is required'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
    }
    next();
  }
];

export const validateAIRequest = [
  body('scores').notEmpty().withMessage('Scores are required'),
  body('keyChallenge').optional().isLength({ max: 500 }).trim().escape(),
  body('techReadiness').optional().isLength({ max: 500 }).trim().escape(),
  body('painPoint').optional().isLength({ max: 500 }).trim().escape(),
  body('businessType').optional().isLength({ max: 100 }).trim().escape(),
  body('teamSize').optional().isLength({ max: 100 }).trim().escape(),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
    }
    next();
  }
];