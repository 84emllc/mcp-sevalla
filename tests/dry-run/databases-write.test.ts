// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { SevallaAPI } from '../../src/sevalla-api.js';
import { installFetchSpy } from '../helpers/fetch-spy.js';

const API_KEY = 'test-api-key';
const COMPANY_ID = 'test-company-id';

describe('databases write operations (dry-run)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('createDatabase sends POST with full body including company', async () => {
    const { captured } = installFetchSpy({ database: { id: 'new-db' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.createDatabase({
      location: 'us-east1',
      resource_type: 'db-standard-1',
      display_name: 'Test DB',
      db_name: 'testdb',
      db_password: 'secret123',
      type: 'postgresql',
      version: '16',
      db_user: 'admin',
      company: COMPANY_ID,
    });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/databases');
    expect(captured[0].body).toMatchObject({
      location: 'us-east1',
      resource_type: 'db-standard-1',
      display_name: 'Test DB',
      db_name: 'testdb',
      db_password: 'secret123',
      type: 'postgresql',
      version: '16',
      db_user: 'admin',
      company: COMPANY_ID,
    });
  });

  it('updateDatabase sends PUT with correct URL and body', async () => {
    const { captured } = installFetchSpy({ database: { id: 'db-1' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.updateDatabase('db-1', { display_name: 'Updated DB', resource_type: 'db-standard-2' });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('PUT');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/databases/db-1');
    expect(captured[0].body).toEqual({ display_name: 'Updated DB', resource_type: 'db-standard-2' });
  });

  it('deleteDatabase sends DELETE with correct URL', async () => {
    const { captured } = installFetchSpy({}, 204);
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.deleteDatabase('db-to-delete');

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('DELETE');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/databases/db-to-delete');
    expect(captured[0].body).toBeUndefined();
  });

  it('createDatabase for redis omits db_user', async () => {
    const { captured } = installFetchSpy({ database: { id: 'redis-db' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.createDatabase({
      location: 'europe-west1',
      resource_type: 'db-standard-1',
      display_name: 'Redis Cache',
      db_name: 'cache',
      db_password: 'secret',
      type: 'redis',
      version: '7',
      company: COMPANY_ID,
    });

    expect(captured[0].body.db_user).toBeUndefined();
    expect(captured[0].body.type).toBe('redis');
  });
});
