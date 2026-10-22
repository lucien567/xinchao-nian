import assert from 'node:assert/strict';
import test from 'node:test';

import { obProxyTimeoutMs } from '../src/ob-proxy-timeout.js';

test('OB write tools get enough time to return a receipt', () => {
  for (const tool of ['diary_write', 'grow', 'hold', 'I']) {
    assert.equal(obProxyTimeoutMs(tool), 75000, tool);
  }
});

test('OB read tools keep the short gateway timeout', () => {
  for (const tool of ['breath', 'breath_search', 'breath_reliable', 'pulse']) {
    assert.equal(obProxyTimeoutMs(tool), 15000, tool);
  }
});
