// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { createApi, hasCredentials, RATE_LIMIT_DELAY } from '../setup.js';
import type { SevallaAPI } from '../../src/sevalla-api.js';

describe.skipIf(!hasCredentials)('databases endpoints (integration)', { timeout: 30_000 }, () => {
  let api: SevallaAPI;

  beforeAll(() => {
    api = createApi();
  });

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
  });

  it('listDatabases returns items array', async () => {
    const data = await api.getDatabases({ limit: 5 });

    expect(data).toHaveProperty('company');
    expect(data.company).toHaveProperty('databases');
    expect(data.company.databases).toHaveProperty('items');
    expect(Array.isArray(data.company.databases.items)).toBe(true);
  });

  it('listDatabases respects limit parameter', async () => {
    const data = await api.getDatabases({ limit: 2 });

    expect(data.company.databases.items.length).toBeLessThanOrEqual(2);
  });

  it('getDatabase returns details for first database', async () => {
    const list = await api.getDatabases({ limit: 1 });
    const items = list.company.databases.items;

    if (items.length === 0) {
      console.warn('No databases found, skipping getDatabase test');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));

    const data = await api.getDatabase(items[0].id);

    expect(data).toHaveProperty('database');
    expect(data.database).toHaveProperty('id');
    expect(data.database.id).toBe(items[0].id);
  });

  it('getDatabase with bogus UUID returns error', async () => {
    try {
      await api.getDatabase('00000000-0000-0000-0000-000000000000');
      expect.fail('Expected an error for bogus UUID');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/40[04]/);
    }
  });
});
