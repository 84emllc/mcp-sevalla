#!/usr/bin/env node
// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { SevallaAPI } from './sevalla-api.js';
import { tools } from './tools.js';
import { handleToolCall } from './handler.js';

config();

const VERSION = '1.0.0';

if (process.argv.includes('--version')) {
  console.log(VERSION);
  process.exit(0);
}

if (process.argv.includes('--help')) {
  console.log(`mcp-sevalla v${VERSION} - MCP server for Sevalla cloud hosting API`);
  console.log('Environment variables: SEVALLA_API_KEY, SEVALLA_COMPANY_ID');
  process.exit(0);
}

const API_KEY = process.env.SEVALLA_API_KEY?.trim();
const COMPANY_ID = process.env.SEVALLA_COMPANY_ID?.trim();

if (!API_KEY) {
  console.error('Missing required environment variable: SEVALLA_API_KEY');
  process.exit(1);
}

if (!COMPANY_ID) {
  console.error('Missing required environment variable: SEVALLA_COMPANY_ID');
  process.exit(1);
}

const api = new SevallaAPI(API_KEY, COMPANY_ID);

const server = new Server(
  { name: 'mcp-sevalla', version: VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return handleToolCall(api, COMPANY_ID, name, args as Record<string, unknown> | undefined);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`mcp-sevalla v${VERSION} running`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
