import express from 'express';
import { generateCodeReview } from '../services/llmService.js';

const router = express.Router();
const MAX_LINES = 200;

router.post('/review', async (req, res) => {
  try {
    const { code, language } = req.body;

    // 1. Check for empty input
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid Input',
        message: 'Code snippet cannot be empty. Please paste code to review.'
      });
    }

    const selectedLanguage = language && typeof language === 'string' ? language : 'javascript';

    // 2. Check line count limit (~200 lines)
    const lineCount = code.split(/\r\n|\r|\n/).length;
    if (lineCount > MAX_LINES) {
      return res.status(400).json({
        error: 'Payload Too Large',
        message: `Code snippet exceeds maximum limit of ${MAX_LINES} lines (received ${lineCount} lines). Please trim the snippet and try again.`,
        lineCount,
        maxLines: MAX_LINES
      });
    }

    // 3. Call LLM Service
    const reviewResult = await generateCodeReview(code, selectedLanguage);

    // 4. Return success response
    return res.status(200).json({
      success: true,
      data: reviewResult,
      meta: {
        lineCount,
        language: selectedLanguage,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error handling /api/review:', error);

    // Check specific error messages
    const isApiKeyError = error.message.includes('GROQ_API_KEY');
    
    return res.status(isApiKeyError ? 500 : 502).json({
      error: isApiKeyError ? 'Configuration Error' : 'Review Generation Failed',
      message: error.message || 'An unexpected error occurred while reviewing the code.'
    });
  }
});

export default router;
