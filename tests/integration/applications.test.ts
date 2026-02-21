// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { createApi, hasCredentials, RATE_LIMIT_DELAY } from '../setup.js';
import type { SevallaAPI } from '../../src/sevalla-api.js';

describe.skipIf(!hasCredentials)('applications endpoints (integration)', { timeout: 30_000 }, () => {
  let api: SevallaAPI;

  beforeAll(() => {
    api = createApi();
  });

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
  });

  it('listApplications returns items array', async () => {
    const data = await api.getApplications({ limit: 5 });

    expect(data).toHaveProperty('company');
    expect(data.company).toHaveProperty('apps');
    expect(data.company.apps).toHaveProperty('items');
    expect(Array.isArray(data.company.apps.items)).toBe(true);
  });

  it('listApplications respects limit parameter', async () => {
    const data = await api.getApplications({ limit: 2 });

    expect(data.company.apps.items.length).toBeLessThanOrEqual(2);
  });

  it('listApplications with offset returns results', async () => {
    const data = await api.getApplications({ limit: 5, offset: 0 });

    expect(data).toHaveProperty('company');
    expect(Array.isArray(data.company.apps.items)).toBe(true);
  });

  it('getApplication returns app details for first app', async () => {
    const list = await api.getApplications({ limit: 1 });
    const items = list.company.apps.items;

    if (items.length === 0) {
      console.warn('No applications found, skipping getApplication test');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));

    const data = await api.getApplication(items[0].id);

    expect(data).toHaveProperty('app');
    expect(data.app).toHaveProperty('id');
    expect(data.app.id).toBe(items[0].id);
  });

  it('getApplication with bogus UUID returns 404 or error', async () => {
    try {
      await api.getApplication('00000000-0000-0000-0000-000000000000');
      expect.fail('Expected an error for bogus UUID');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/40[04]/);
    }
  });
});
