import fetch from 'node-fetch';
import type { Request, Response } from 'express';
import { buildPrompt } from '../utils/aiPrompt';

export const handleGenerateAiSummary = async (req: Request, res: Response) => {
  const { scores, keyChallenge = 'workflow efficiency', techReadiness, painPoint, businessType, teamSize } = req.body;

  console.log('🤖 Received AI summary request with data:', {
    scores: scores ? 'present' : 'missing',
    keyChallenge,
    techReadiness: techReadiness ? 'present' : 'not provided',
    painPoint: painPoint ? 'present' : 'not provided',
    businessType: businessType || 'not provided',
    teamSize: teamSize || 'not provided'
  });

  if (!scores || !scores.byCategory) {
    console.error('❌ Missing scores data in request');
    res.status(400).json({ error: 'Missing scores data' });
    return;
  }

  const prompt = buildPrompt(scores, keyChallenge, techReadiness, painPoint, businessType, teamSize);
  console.log('📝 Generated prompt length:', prompt.length);

  try {
    console.log('🚀 Calling OpenAI API...');
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY?.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const err = await openaiResponse.json();
      console.error("❌ OpenAI error:", err);
      res.status(500).json({ error: 'Failed to get summary from GPT' });
      return;
    }

    const json = await openaiResponse.json() as {
      choices: { message: { content: string } }[];
    };

    const summary = json.choices?.[0]?.message?.content || 'No summary returned.';
    console.log('✅ OpenAI response received, summary length:', summary.length);
    res.json({ summary });
  } catch (error) {
    console.error("❌ GPT error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};