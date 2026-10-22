const WRITE_TOOLS = new Set(['diary_write', 'grow', 'hold', 'I']);

export function obProxyTimeoutMs(name) {
  return WRITE_TOOLS.has(String(name)) ? 75000 : 15000;
}
