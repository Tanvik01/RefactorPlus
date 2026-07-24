import { generateCodeReview } from './services/llmService.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleReactCode = `import React, { useState, useEffect } from 'react';

export default function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user/' + userId)
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return (
    <div>
      <h2>{user ? user.name : 'Loading...'}</h2>
    </div>
  );
}`;

async function runTest() {
  console.log('--- Testing RefactorPulse AI LLM Output Shape ---');
  try {
    const review = await generateCodeReview(sampleReactCode, 'jsx');
    console.log('✅ Validation Succeeded! LLM Output Schema:');
    console.log(JSON.stringify(review, null, 2));
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
  }
}

runTest();
