import { Request, Response } from 'express';
import { ChatGPTService } from '../services/ChatGPTService';

export const translate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, sourceLang = 'it', targetLang = 'en' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const translation = await ChatGPTService.translate(text, sourceLang, targetLang);
    res.json({ translation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Translation failed' 
    });
  }
};

export const generatePhrase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { word } = req.body;

    if (!word || typeof word !== 'string') {
      res.status(400).json({ error: 'Word is required' });
      return;
    }

    const phrase = await ChatGPTService.generatePhrase(word);
    res.json({ phrase });
  } catch (error) {
    console.error('Phrase generation error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Phrase generation failed' 
    });
  }
};

