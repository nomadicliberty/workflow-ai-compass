import { body, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

// Email validation rules
export const emailValidationRules = [
  body('userEmail').isEmail().normalizeEmail(),
  body('userName').optional().isLength({ min: 1, max: 100 }).trim().escape(),
  body('painPoint').optional().isLength({ max: 500 }).trim().escape(),
  body('techReadiness').optional().isLength({ max: 500 }).trim().escape(),
  body('report').notEmpty().withMessage('Report is required'),
];

// AI validation rules
export const aiValidationRules = [
  body('scores').notEmpty().withMessage('Scores are required'),
  body('keyChallenge').optional().isLength({ max: 500 }).trim().escape(),
  body('techReadiness').optional().isLength({ max: 500 }).trim().escape(),
  body('painPoint').optional().isLength({ max: 500 }).trim().escape(),
  body('businessType').optional().isLength({ max: 100 }).trim().escape(),
  body('teamSize').optional().isLength({ max: 100 }).trim().escape(),
];

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Invalid input data', details: errors.array() });
    return;
  }
  next();
};