import { z } from 'zod';

export const issueSchema = z.object({
  category: z.enum(['performance', 'security', 'readability']),
  description: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high'])
});

export const refactorSchema = z.object({
  before: z.string(),
  after: z.string(),
  explanation: z.string()
});

export const reviewResponseSchema = z.object({
  score: z.number().min(1).max(10),
  summary: z.string().min(1),
  issues: z.array(issueSchema),
  refactor: refactorSchema
});

/**
 * Validates and cleans a raw JSON object against the review schema.
 * Performs minor normalization (e.g. string to number, lowercasing enums) if necessary.
 */
export function validateAndCleanReview(rawData) {
  if (typeof rawData !== 'object' || rawData === null) {
    throw new Error('LLM response must be a JSON object');
  }

  // Pre-normalize fields if needed
  const normalized = { ...rawData };

  if (typeof normalized.score === 'string') {
    normalized.score = parseInt(normalized.score, 10);
  }

  if (Array.isArray(normalized.issues)) {
    normalized.issues = normalized.issues.map((issue) => {
      if (typeof issue !== 'object' || issue === null) return issue;
      return {
        ...issue,
        category: (issue.category || 'readability').toString().toLowerCase(),
        severity: (issue.severity || 'medium').toString().toLowerCase()
      };
    });
  }

  return reviewResponseSchema.parse(normalized);
}
