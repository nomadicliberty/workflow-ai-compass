export function buildPrompt(scores: any, keyChallenge: string, techReadiness?: string, painPoint?: string): string {
  const { overall, totalTimeSavings, byCategory } = scores;

  const categories = Object.entries(byCategory)
    .map(([name, data]: any) => `- ${name}: ${data.score}/100 (${data.level})`)
    .join('\n');

  let personalContext = '';
  const challenge = painPoint || keyChallenge;
  
  if (challenge) {
    personalContext += `Their biggest operational challenge is: ${challenge}\n`;
  }
  
  if (techReadiness) {
    personalContext += `Their team's attitude toward new technology: ${techReadiness}\n`;
  }

  return `
You are an AI automation consultant generating a friendly, human-readable report for a small business owner who just completed a workflow audit.

${personalContext}
Their overall automation score is ${overall}/100  
They could save about ${totalTimeSavings} hours per week with improvements.

Category breakdown:
${categories}

Please write a comprehensive, personalized report that:

1. Addresses their specific challenge ("${challenge}") in the opening
2. ${techReadiness ? `Considers their team's technology comfort level (${techReadiness}) when making recommendations` : 'Uses accessible, non-technical language'}
3. For each category, explains what the score means and offers 2–3 specific improvement suggestions
4. Recommends practical tools or platforms they could try
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