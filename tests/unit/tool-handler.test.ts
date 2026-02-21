// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { handleToolCall } from '../../src/handler.js';
import { SevallaAPI } from '../../src/sevalla-api.js';
import { installFetchSpy } from '../helpers/fetch-spy.js';

const COMPANY_ID = 'test-company-id';

function createTestApi() {
  return new SevallaAPI('test-api-key', COMPANY_ID);
}

describe('handleToolCall', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns formatted JSON for a successful read', async () => {
    const mockData = { company: { users: [{ user: { id: '1', email: 'test@test.com', image: '', full_name: 'Test' } }] } };
    installFetchSpy(mockData);
    const api = createTestApi();

    const result = await handleToolCall(api, COMPANY_ID, 'sevalla_get_company_users', undefined);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.company.users).toHaveLength(1);
  });

  it('returns error object for unknown tool', async () => {
    installFetchSpy();
    const api = createTestApi();

    const result = await handleToolCall(api, COMPANY_ID, 'sevalla_nonexistent', undefined);

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.message).toContain('Unknown tool');
  });

  it('returns error object when API throws', async () => {
    const spy = vi.fn(async () => new Response('Unauthorized', { status: 401 }));
    vi.stubGlobal('fetch', spy);
    const api = createTestApi();

    const result = await handleToolCall(api, COMPANY_ID, 'sevalla_get_company_users', undefined);

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.message).toContain('Authentication failed');
  });

  it('passes arguments correctly for list with pagination', async () => {
    const { captured } = installFetchSpy({ company: { apps: { items: [] } } });
    const api = createTestApi();

    await handleToolCall(api, COMPANY_ID, 'sevalla_list_applications', { limit: 5, offset: 10 });

    expect(captured).toHaveLength(1);
    expect(captured[0].url).toContain('limit=5');
    expect(captured[0].url).toContain('offset=10');
  });

  it('passes arguments correctly for delete', async () => {
    const { captured } = installFetchSpy({}, 204);
    const api = createTestApi();

    const result = await handleToolCall(api, COMPANY_ID, 'sevalla_delete_application', { app_id: 'abc-123' });

    expect(captured).toHaveLength(1);
    expect(captured[0].url).toContain('/applications/abc-123');
    expect(captured[0].method).toBe('DELETE');
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
  });

  it('passes body for create database', async () => {
    const { captured } = installFetchSpy({ database: { id: 'new-db' } });
    const api = createTestApi();

    await handleToolCall(api, COMPANY_ID, 'sevalla_create_database', {
      location: 'us-east1',
      resource_type: 'db-standard-1',
      display_name: 'Test DB',
      db_name: 'testdb',
      db_password: 'secret',
      type: 'postgresql',
      version: '16',
    });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].body).toMatchObject({
      location: 'us-east1',
      type: 'postgresql',
      company: COMPANY_ID,
    });
  });
});
