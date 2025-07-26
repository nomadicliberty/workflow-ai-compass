// api/generateAiSummary.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    return res.status(400).json({ error: 'Missing scores data' });
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
      return res.status(500).json({ error: 'Failed to get summary from GPT' });
    }

    const json = await openaiResponse.json();
    const summary = json.choices?.[0]?.message?.content || 'No summary returned.';
    console.log('✅ OpenAI response received, summary length:', summary.length);
    return res.json({ summary });
  } catch (error) {
    console.error("❌ GPT error:", error);
    return res.status(500).json({ error: 'Internal server error' });
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
You are an AI automation consultant generating a friendly, human-readable report for a small business owner who just completed a workflow audit.

${personalContext}Their overall automation score is ${overall}/100  
They could save about ${totalTimeSavings} hours per week with improvements.

Category breakdown:
${categories}

${industryContext}

Please write a comprehensive, personalized report that:

1. Addresses their specific challenge ("${challenge}") in the opening${businessType && businessType !== 'Other' ? ` within the context of the ${businessType.toLowerCase()} industry` : ''}
2. ${techReadiness ? `Considers their team's technology comfort level (${techReadiness}) when making recommendations` : 'Uses accessible, non-technical language'}
3. For each category, explains what the score means and offers 2–3 specific improvement suggestions${businessType && businessType !== 'Other' ? ` relevant to ${businessType.toLowerCase()} businesses` : ''}
4. Recommends practical tools or platforms they could try${businessType && businessType !== 'Other' ? `, with preference for solutions commonly used in ${businessType.toLowerCase()}` : ''}
5. Maintains an encouraging, supportive tone throughout

End with a paragraph explaining how Nomadic Liberty, the consultancy that provided this audit, can help implement these improvements with hands-on support tailored to their specific needs and comfort level.

CRITICAL FORMATTING REQUIREMENTS:
- This is an analytical report, NOT a letter or email
- Start directly with analysis content - no greetings like "Dear Business Owner" or "Hello"
- End with the Nomadic Liberty paragraph - no sign-offs like "Best regards" or "Sincerely"
- Use educational language like 'areas to explore' and 'you might consider' rather than prescriptive recommendations
- Avoid listing specific software tool names
- Keep the tone collaborative and helpful, not expert or authoritative
- Present as a direct business analysis without any personal communication formatting
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