import Groq from 'groq-sdk';
import { validateAndCleanReview } from '../utils/schemaValidator.js';

const SYSTEM_INSTRUCTION = `You are a senior software engineer conducting a code review. You will be given a code snippet with its language specified.

Review it as if this were a real pull request. Evaluate the code against exactly three categories, in this order:
1. PERFORMANCE — unnecessary re-renders, inefficient loops/queries, blocking operations, memory leaks, missing memoization where it matters
2. SECURITY — injection risks, unvalidated input, exposed secrets, unsafe deserialization, missing auth checks, XSS/CSRF exposure
3. READABILITY — naming, function length, nesting depth, dead code, missing error handling

For each category, think through the code line by line before deciding whether it has issues. Do not flag stylistic nitpicks as issues — only flag things that would matter in a real review.

Score the code from 1-10 using this rubric:
- 9-10: no meaningful issues found across any category
- 6-8: only low-severity issues (readability/style-level concerns)
- 3-5: at least one medium-severity issue, or several low-severity issues compounding
- 1-2: at least one high-severity issue (security vulnerability, data loss risk, or a bug that breaks core functionality)

For the refactor:
- "before" should be the specific flawed lines, not the entire snippet, unless the whole snippet needs restructuring
- "after" must be a working replacement, not a partial sketch
- "explanation" should state the concrete consequence of the original code (what breaks, what it costs, what it exposes) in one or two sentences — not a vague "this is better"

If the code has no real issues, say so directly. Do not invent issues to fill out the response — a 9/10 with an empty issues array is a valid, complete review.

CRITICAL REQUIREMENT:
You MUST respond with ONLY strictly valid JSON. No prose, no markdown code fences, no backticks. Your entire response must be parseable JSON matching this exact schema:

{
  "score": <number 1-10>,
  "summary": "<1-2 sentences summarizing the overall quality and most important finding>",
  "issues": [
    {
      "category": "performance" | "security" | "readability",
      "description": "<actionable description of the issue — what it breaks, costs, or exposes>",
      "severity": "low" | "medium" | "high"
    }
  ],
  "refactor": {
    "before": "<the specific flawed lines, not the whole snippet unless necessary>",
    "after": "<a working replacement — not a sketch>",
    "explanation": "<concrete consequence of the original code in 1-2 sentences>"
  }
}`;

/**
 * Clean markdown code fences if present in LLM response string
 */
function cleanJsonString(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

/**
 * Call Groq API using groq-sdk
 */
async function callGroq(apiKey, code, language, extraInstruction = '') {
  const groq = new Groq({ apiKey });

  const userPrompt = `Language: ${language}

Code snippet to review:
\`\`\`${language}
${code}
\`\`\`
${extraInstruction ? `\n${extraInstruction}` : ''}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2,
    max_tokens: 4096,
    response_format: { type: 'json_object' }
  });

  return completion.choices[0].message.content;
}

/**
 * Generate code review with schema validation and single retry strategy
 */
export async function generateCodeReview(code, language) {
  const apiKey = (process.env.GROQ_API_KEY || '').trim();

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY is not configured in server environment (.env)');
  }

  // Attempt 1
  let rawText = '';
  try {
    rawText = await callGroq(apiKey, code, language);
    const cleanedText = cleanJsonString(rawText);
    const rawJson = JSON.parse(cleanedText);
    return validateAndCleanReview(rawJson);
  } catch (firstAttemptError) {
    console.warn('Attempt 1 failed schema parsing:', firstAttemptError.message, 'Retrying once...');

    // Attempt 2 — stricter retry instruction
    try {
      const retryExtraInstruction = `STRICT RETRY: Your previous output failed JSON schema validation: "${firstAttemptError.message}".
Ensure all four keys exist: "score" (number 1-10), "summary" (string), "issues" (array with "category", "description", "severity"), "refactor" (object with "before", "after", "explanation").
Output ONLY raw valid JSON — no prose, no code fences.`;

      rawText = await callGroq(apiKey, code, language, retryExtraInstruction);
      const cleanedText = cleanJsonString(rawText);
      const rawJson = JSON.parse(cleanedText);
      return validateAndCleanReview(rawJson);
    } catch (retryError) {
      console.error('Attempt 2 also failed:', retryError.message);
      throw new Error(`Failed to parse structured code review after 2 attempts: ${retryError.message}`);
    }
  }
}
