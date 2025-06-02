
import express from 'express';
import fetch from 'node-fetch';
import type { Request, Response } from 'express';
import { EMAIL_CONFIG } from '../config/constants';
import { buildPrompt } from '../utils/promptBuilder';

const router = express.Router();

router.post('/generateAiSummary', async (req: Request, res: Response) => {
  try {
    const { scores, keyChallenge = 'workflow efficiency', techReadiness, painPoint } = req.body;

    if (!scores || !scores.byCategory) {
      return res.status(400).json({ error: 'Missing scores data' });
    }

    const prompt = buildPrompt(scores, keyChallenge, techReadiness, painPoint);

    const openaiResponse = await fetch(EMAIL_CONFIG.OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY?.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: EMAIL_CONFIG.OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const err = await openaiResponse.json();
      console.error("❌ OpenAI error:", err);
      return res.status(500).json({ error: 'Failed to get summary from GPT' });
    }

    const json = await openaiResponse.json() as {
      choices: { message: { content: string } }[];
    };

    const summary = json.choices?.[0]?.message?.content || 'No summary returned.';
    res.json({ summary });
  } catch (error) {
    console.error("❌ GPT error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
