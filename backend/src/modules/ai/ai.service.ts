import axios from 'axios';
import { env } from '../../config/env.js';

export const askTutor = async (question: string, context: string) => {
  try {
    // Assuming an OpenAI-compatible endpoint for Llama 3.3
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: env.AI_MODEL,
      messages: [
        { role: "system", content: `You are a helpful AI Tutor for an LMS called KodNest. Context: ${context}` },
        { role: "user", content: question }
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${env.LLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error("AI Tutor Error:", error.response?.data || error.message);
    throw new Error("Failed to get response from AI Tutor");
  }
};
