import { Request, Response } from 'express';
import * as aiService from './ai.service.js';

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;
    const answer = await aiService.askTutor(question, context);
    res.json({ answer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
