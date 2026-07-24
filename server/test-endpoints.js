import http from 'http';

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      {
        host: 'localhost',
        port: 5000,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testApi() {
  console.log('--- 1. Empty Code Input Test ---');
  const r1 = await post('/api/review', { code: '', language: 'javascript' });
  console.log('Status:', r1.status, r1.data);

  console.log('\n--- 2. Oversized 200+ Lines Code Input Test ---');
  const longCode = Array.from({ length: 205 }, (_, i) => `// Line ${i + 1}`).join('\n');
  const r2 = await post('/api/review', { code: longCode, language: 'javascript' });
  console.log('Status:', r2.status, r2.data);

  console.log('\n--- 3. Missing API Key Handling Test ---');
  const r3 = await post('/api/review', { code: 'const a = 1;', language: 'javascript' });
  console.log('Status:', r3.status, r3.data);
}

testApi().catch(console.error);
