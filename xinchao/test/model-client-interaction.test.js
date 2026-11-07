import test from 'node:test';
import assert from 'node:assert/strict';

import { ModelClient } from '../src/model-client.js';

test('interaction prompt prioritizes self-blame when he owns the mistake without arguing', async () => {
  const originalFetch = globalThis.fetch;
  let requestBody;
  globalThis.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        type: 'loss', sub: '自责', tone: 'conflicted', warmth: 0.2, tension: 0.8,
      }) } }],
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };

  try {
    const client = new ModelClient({
      enabled: true,
      baseUrl: 'https://example.invalid/v1',
      apiKey: 'test-key',
      name: 'test-model',
      timeoutMs: 1000,
      maxInputChars: 10000,
      maxOutputTokens: 650,
    });
    const result = await client.classifyInteraction(
      '她说：你又忘了答应我的事，我真的还在生气。\n他回：对不起，是我错了，我不辩解。',
    );

    assert.match(requestBody.messages[0].content, /明确认错、道歉或自责，且没有反驳、推责/);
    assert.match(requestBody.messages[0].content, /type 必须是 loss、sub 必须是 自责/);
    assert.deepEqual({ type: result.type, sub: result.sub }, { type: 'loss', sub: '自责' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
