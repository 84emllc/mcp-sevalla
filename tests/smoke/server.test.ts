// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { resolve } from 'node:path';
import { describe, it, expect, afterEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const projectRoot = resolve(import.meta.dirname, '../..');
const tsxBin = resolve(projectRoot, 'node_modules/.bin/tsx');

describe('MCP server smoke test', { timeout: 15_000 }, () => {
  let client: Client | null = null;
  let transport: StdioClientTransport | null = null;

  afterEach(async () => {
    if (client) {
      try {
        await client.close();
      } catch { /* ignore */ }
    }
    if (transport) {
      try {
        await transport.close();
      } catch { /* ignore */ }
    }
  });

  it('starts and responds to tools/list with 28 tools', async () => {
    transport = new StdioClientTransport({
      command: tsxBin,
      args: ['src/index.ts'],
      cwd: projectRoot,
      env: {
        ...process.env,
        SEVALLA_API_KEY: 'smoke-test-key',
        SEVALLA_COMPANY_ID: 'smoke-test-company',
      } as Record<string, string>,
    });

    client = new Client(
      { name: 'smoke-test', version: '1.0.0' },
      { capabilities: {} },
    );

    await client.connect(transport);

    const result = await client.listTools();

    expect(result.tools).toHaveLength(28);

    for (const tool of result.tools) {
      expect(tool.name).toMatch(/^sevalla_/);
    }
  });
});
