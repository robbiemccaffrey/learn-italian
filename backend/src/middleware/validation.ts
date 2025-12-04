import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// YouTube URL validation
const youtubeUrlSchema = Joi.object({
  videoUrl: Joi.string()
    .uri()
    .pattern(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/)
    .required()
    .messages({
      'string.pattern.base': 'Must be a valid YouTube URL',
      'any.required': 'Video URL is required'
    }),
  segmentDuration: Joi.number()
    .integer()
    .min(3)
    .max(30)
    .optional()
    .default(8),
  includeTranslation: Joi.boolean()
    .optional()
    .default(true)
});

// Segment request validation
const segmentRequestSchema = Joi.object({
  videoId: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]{11}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid video ID format'
    }),
  segmentId: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Segment ID must be a number'
    })
});

// Translation request validation
const translationSchema = Joi.object({
  text: Joi.string()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'any.required': 'Text is required for translation',
      'string.max': 'Text must be less than 5000 characters'
    }),
  sourceLang: Joi.string()
    .length(2)
    .optional()
    .default('it'),
  targetLang: Joi.string()
    .length(2)
    .optional()
    .default('en')
});

export const validateVideoUrl = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = youtubeUrlSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      error: error.details[0].message
    });
    return;
  }
  
  req.body = value;
  next();
};

export const validateSegmentRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = segmentRequestSchema.validate(req.params);
  
  if (error) {
    res.status(400).json({
      error: error.details[0].message
    });
    return;
  }
  
  req.params = value;
  next();
};

export const validateTranslationRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = translationSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      error: error.details[0].message
    });
    return;
  }
  
  req.body = value;
  next();
};


