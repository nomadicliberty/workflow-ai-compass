// api/generateAiSummary.js

import Anthropic from '@anthropic-ai/sdk';

// Simple rate limiting store (in production, use Redis)
const rateLimitStore = new Map();

// Input validation
function validateInput(text, maxLength = 500) {
  if (!text || typeof text !== 'string') return false;
  if (text.length > maxLength) return false;
  // Check for script tags and other XSS patterns
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(text)) return false;
  return true;
}

// Updated rate limiting: 10 requests per hour instead of 15 minutes
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 10; // 10 requests per hour
  
  const userRequests = rateLimitStore.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  return true;
}

export default async function handler(req, res) {
  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. You can generate up to 10 AI reports per hour. Please try again later.' 
    });
  }

  // CORS
  const allowedOrigins = [
    'https://audit.nomadicliberty.com',
    'http://localhost:8080',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Request size check
  const requestSize = JSON.stringify(req.body).length;
  if (requestSize > 10000) {
    return res.status(413).json({ error: 'Request too large' });
  }

  const { scores, keyChallenge = 'workflow efficiency', techReadiness, painPoint, businessType, teamSize } = req.body;

  // Input validation
  if (keyChallenge && !validateInput(keyChallenge)) return res.status(400).json({ error: 'Invalid key challenge input' });
  if (techReadiness && !validateInput(techReadiness)) return res.status(400).json({ error: 'Invalid tech readiness input' });
  if (painPoint && !validateInput(painPoint)) return res.status(400).json({ error: 'Invalid pain point input' });
  if (businessType && !validateInput(businessType, 100)) return res.status(400).json({ error: 'Invalid business type input' });
  if (teamSize && !validateInput(teamSize, 50)) return res.status(400).json({ error: 'Invalid team size input' });

  if (!scores || !scores.byCategory || typeof scores.overall !== 'number') {
    return res.status(400).json({ error: 'Invalid scores data' });
  }

  const prompt = buildPrompt(scores, keyChallenge, techReadiness, painPoint, businessType, teamSize);

  try {
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY?.trim(),
    });

    // Claude API call
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: "You are a professional AI consultant writing a clear, well-structured audit report. Be concise and direct.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    console.log("✅ Raw Claude API response:", JSON.stringify(message, null, 2));

    // Extract content from Claude response
    const summary = message.content?.[0]?.text || 'No summary returned.';

    console.log("📄 Generated audit report:", summary);

    return res.json({ summary });

  } catch (error) {
    console.error("💥 API processing error:", error);
    
    // Enhanced error handling for Claude-specific errors
    let errorMessage = 'Internal server error';
    
    if (error.status === 400) {
      errorMessage = 'Invalid request format';
    } else if (error.status === 401) {
      errorMessage = 'Authentication failed';
    } else if (error.status === 403) {
      errorMessage = 'Request forbidden';
    } else if (error.status === 429) {
      errorMessage = 'Claude API rate limit exceeded';
    } else if (error.status === 500) {
      errorMessage = 'Claude API server error';
    }

    return res.status(error.status || 500).json({
      error: process.env.NODE_ENV !== 'production' ? error.message : errorMessage
    });
  }
}

function buildPrompt(scores, keyChallenge, techReadiness, painPoint, businessType, teamSize) {
  const { overall, totalTimeSavings, byCategory } = scores;

  const categories = Object.entries(byCategory)
    .map(([name, data]) => `- ${name}: ${data.score}/100 (${data.level})`)
    .join('\n');

  let personalContext = '';
  const challenge = painPoint || keyChallenge;
  
  if (businessType && businessType !== 'Other') {
    personalContext += `Industry: ${businessType}\n`;
  }
  
  if (teamSize) {
    personalContext += `Team size: ${teamSize}\n`;
  }
  
  if (challenge) {
    personalContext += `Their biggest operational challenge is: ${challenge}\n`;
  }
  
  if (techReadiness) {
    personalContext += `Their team's attitude toward new technology: ${techReadiness}\n`;
  }

  // Add industry-specific context
  let industryContext = '';
  if (businessType && businessType !== 'Other') {
    industryContext = getIndustrySpecificContext(businessType);
  }

  return `
Generate a concise, well-formatted workflow automation report for a business owner.

Context:
${personalContext}Overall automation score: ${overall}/100
Potential time savings: ${totalTimeSavings} hours per week

Category scores:
${categories}

${industryContext}

Requirements:
- Write a CONCISE report (max 800 words)
- Address their main challenge: "${challenge}"
- ${techReadiness ? `Consider their tech comfort level: ${techReadiness}` : 'Use simple, accessible language'}
- Use clear headings and bullet points for readability
- Focus on 1-2 actionable recommendations per category, not exhaustive lists
- Avoid lengthy explanations - be direct and practical

Format:
## Executive Summary
Brief overview addressing their challenge and potential savings.

## Key Opportunities
For each category with scores under 70, provide:
- **Category Name (Score/100)**: What this means in 1 sentence
- Quick recommendations (2-3 bullet points max)

## Implementation Approach
Brief paragraph on getting started based on their tech readiness.

## How Nomadic Liberty Can Help
One paragraph explaining our hands-on support approach.

Keep it scannable, professional, and actionable. Avoid verbose explanations.
`;
}

function getIndustrySpecificContext(businessType) {
  const industryContexts = {
    'Healthcare': `
INDUSTRY CONTEXT: Healthcare practices have unique automation opportunities around patient scheduling, insurance verification, billing workflows, and compliance documentation. Consider HIPAA compliance requirements when suggesting any patient data handling solutions.`,
    
    'E-commerce': `
INDUSTRY CONTEXT: E-commerce businesses benefit greatly from automating inventory management, order processing, customer service responses, and marketing campaigns. Focus on solutions that can handle high transaction volumes and integrate with popular platforms.`,
    
    'Professional Services': `
INDUSTRY CONTEXT: Professional service firms typically need automation for client onboarding, project management, time tracking, invoicing, and proposal generation. Emphasize solutions that maintain the personal touch clients expect.`,
    
    'Manufacturing': `
INDUSTRY CONTEXT: Manufacturing operations can automate supply chain management, quality control documentation, maintenance scheduling, and production reporting. Consider solutions that integrate with existing equipment and ERP systems.`,
    
    'Real Estate': `
INDUSTRY CONTEXT: Real estate professionals benefit from automating lead follow-up, property listing management, client communication, document preparation, and transaction tracking. Focus on CRM integration and mobile-friendly solutions.`,
    
    'Legal': `
INDUSTRY CONTEXT: Legal practices can automate document assembly, time tracking, client intake, case management, and billing processes. Ensure any recommendations consider attorney-client privilege and regulatory compliance requirements.`,
    
    'Retail': `
INDUSTRY CONTEXT: Retail businesses need automation for inventory tracking, customer communications, loyalty programs, staff scheduling, and sales reporting. Consider solutions that work across multiple sales channels.`,
    
    'Construction': `
INDUSTRY CONTEXT: Construction companies benefit from automating project scheduling, materials ordering, progress reporting, safety documentation, and client communications. Focus on mobile-friendly solutions for field work.`
  };

  return industryContexts[businessType] || '';
}